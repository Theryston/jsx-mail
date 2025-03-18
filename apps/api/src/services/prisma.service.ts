import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    const models = {};

    Object.keys(Prisma.ModelName).forEach((key) => {
      models[Prisma.ModelName[key]] = {
        field: 'deletedAt',
        createValue: (deleted) => {
          if (deleted) return new Date();
          return null;
        },
      };
    });

    await this.$connect();
    this.$use(
      createSoftDeleteMiddleware({
        models,
      }),
    );
  }
}
