import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/services/prisma.service';
import { S3ClientService } from '../file/services/s3-client.service';
import { ExportStatus } from '@prisma/client';
import { Readable } from 'stream';
import { messageSelect } from 'src/utils/public-selects';

@Processor('user', { concurrency: 5 })
export class UserProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3ClientService: S3ClientService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    try {
      console.log(`[USER_PROCESSOR] received job id: ${job.id}`);

      if (job.name === 'export-messages') {
        await this.exportMessages(job.data);
        return;
      }

      throw new Error('Invalid job name');
    } catch (error) {
      console.error(`[USER_PROCESSOR] error processing job ${job.id}: `, error);
      throw error;
    }
  }

  private async exportMessages(data: any): Promise<void> {
    console.log(`[USER_PROCESSOR] processing export-messages job`);

    const { exportId } = data;

    if (!exportId) {
      console.error(`[USER_PROCESSOR] export-messages job received without id`);
      return;
    }

    const exportItem = await this.prisma.export.findUnique({
      where: { id: exportId },
    });

    if (!exportItem) {
      console.error(
        `[USER_PROCESSOR] export-messages job received with invalid id`,
      );
      return;
    }

    if (!exportItem.where) {
      await this.prisma.export.update({
        where: { id: exportId },
        data: {
          exportStatus: ExportStatus.failed,
          errorMessage: 'Export where is not set',
        },
      });

      console.error(
        `[USER_PROCESSOR] export-messages job received with invalid id`,
      );

      return;
    }

    const whereStr =
      typeof exportItem.where === 'string'
        ? exportItem.where
        : JSON.stringify(exportItem.where);

    const where = JSON.parse(whereStr);
    const format = exportItem.format || 'csv';

    await this.prisma.export.update({
      where: { id: exportId },
      data: {
        exportStatus: ExportStatus.processing,
      },
    });

    const PER_PAGE = 1000;
    let page = 1;
    const s3Key = `exports/${exportItem.userId}/${exportId}.${format}`;
    let isFirstBatch = true;
    let totalSize = 0;
    let fileId = null;

    try {
      while (true) {
        const messages = await this.prisma.message.findMany({
          where,
          skip: (page - 1) * PER_PAGE,
          take: PER_PAGE,
          select: {
            ...messageSelect,
            messageFiles: false,
            attachments: false,
            senderId: false,
            userId: false,
            sender: {
              select: {
                email: true,
                name: true,
              },
            },
            statusHistory: {
              select: {
                status: true,
                description: true,
                createdAt: true,
                extras: {
                  select: {
                    key: true,
                    value: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        });

        if (messages.length === 0) {
          console.log(`[USER_PROCESSOR] no more messages to export`);
          break;
        }

        console.log(`[USER_PROCESSOR] exporting ${messages.length} messages`);

        let content = '';
        if (format === 'csv') {
          if (isFirstBatch) {
            // Generate headers by flattening arrays
            const headers = this.generateFlattenedHeaders(messages[0]);
            content = headers.join(',') + '\n';
          }

          // Process each message to handle arrays
          for (const msg of messages) {
            const flattenedValues = this.flattenObjectForCsv(msg);
            content +=
              flattenedValues
                .map((val) =>
                  typeof val === 'string'
                    ? `"${val.replace(/"/g, '""')}"`
                    : val,
                )
                .join(',') + '\n';
          }
        } else if (format === 'json') {
          const jsonContent = JSON.stringify(messages);
          content = isFirstBatch
            ? `[${jsonContent.slice(1, -1)}`
            : `,${jsonContent.slice(1, -1)}`;
        }

        totalSize += content.length;

        if (isFirstBatch) {
          const url = await this.s3ClientService.putObject({
            key: s3Key,
            body: Buffer.from(content),
            mimetype: format === 'csv' ? 'text/csv' : 'application/json',
          });

          const createdFile = await this.prisma.file.create({
            data: {
              key: s3Key,
              encoding: 'utf-8',
              hash: '',
              mimeType: format === 'csv' ? 'text/csv' : 'application/json',
              originalName: `${exportId}.${format}`,
              size: totalSize,
              url,
              user: {
                connect: {
                  id: exportItem.userId,
                },
              },
            },
          });

          fileId = createdFile.id;

          await this.prisma.export.update({
            where: { id: exportId },
            data: {
              file: {
                connect: {
                  id: createdFile.id,
                },
              },
            },
          });
        } else {
          const existingObject = await this.s3ClientService.getObject(s3Key);

          const existingContent = await existingObject.Body.transformToString();
          const newContent = existingContent + content;

          await this.s3ClientService.putObject({
            key: s3Key,
            body: Buffer.from(newContent),
            mimetype: format === 'csv' ? 'text/csv' : 'application/json',
          });

          if (fileId) {
            await this.prisma.file.update({
              where: { id: fileId },
              data: {
                size: totalSize,
              },
            });
          }
        }

        isFirstBatch = false;
        page++;
      }

      if (format === 'json' && !isFirstBatch) {
        const existingObject = await this.s3ClientService.getObject(s3Key);

        const existingContent = await existingObject.Body.transformToString();
        const finalContent = existingContent + ']';

        await this.s3ClientService.putObject({
          key: s3Key,
          body: Buffer.from(finalContent),
          mimetype: 'application/json',
        });
      }

      await this.prisma.export.update({
        where: { id: exportId },
        data: {
          exportStatus: ExportStatus.completed,
          errorMessage: null,
        },
      });

      console.log(`[USER_PROCESSOR] export-messages job completed`);
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      await this.prisma.export.update({
        where: { id: exportId },
        data: {
          exportStatus: ExportStatus.failed,
          errorMessage,
        },
      });

      console.error(
        `[USER_PROCESSOR] export-messages job failed: ${errorMessage}`,
      );
    }
  }

  private generateFlattenedHeaders(obj: any): string[] {
    const headers: string[] = [];

    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        const arrayLength = obj[key].length;
        if (arrayLength > 0 && typeof obj[key][0] === 'object') {
          for (let i = 0; i < arrayLength; i++) {
            for (const subKey in obj[key][i]) {
              headers.push(`${key}[${i}].${subKey}`);
            }
          }
        } else {
          headers.push(key);
        }
      } else if (obj[key] !== null && typeof obj[key] === 'object') {
        const nestedKeys = this.generateFlattenedHeaders(obj[key]);
        nestedKeys.forEach((nestedKey) => {
          headers.push(`${key}.${nestedKey}`);
        });
      } else {
        headers.push(key);
      }
    }

    return headers;
  }

  private flattenObjectForCsv(obj: any): any[] {
    const values: any[] = [];

    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        const array = obj[key];
        if (array.length > 0 && typeof array[0] === 'object') {
          for (let i = 0; i < array.length; i++) {
            for (const subKey in array[i]) {
              values.push(array[i][subKey]);
            }
          }
        } else {
          values.push(array.join(';'));
        }
      } else if (obj[key] !== null && typeof obj[key] === 'object') {
        const nestedValues = this.flattenObjectForCsv(obj[key]);
        values.push(...nestedValues);
      } else {
        values.push(obj[key]);
      }
    }

    return values;
  }
}
