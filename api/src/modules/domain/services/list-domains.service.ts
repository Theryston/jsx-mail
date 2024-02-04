import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SESClient, GetIdentityVerificationAttributesCommand } from '@aws-sdk/client-ses';

@Injectable()
export class ListDomainsService {
	constructor(private readonly prisma: PrismaService) { }

	async execute(userId: string) {
		const domains = await this.prisma.domain.findMany({
			where: {
				userId,
				deletedAt: {
					isSet: false
				}
			},
			select: {
				id: true,
				name: true,
				userId: true,
				status: true,
			}
		});

		const result = [];

		for (const domain of domains) {
			if (domain.status !== 'pending') {
				result.push(domain);
				continue;
			};


			const client = new SESClient();

			const getCommand = new GetIdentityVerificationAttributesCommand({
				Identities: [domain.name],
			});

			const getResponse = await client.send(getCommand);

			const verificationAttributes = getResponse.VerificationAttributes;

			if (verificationAttributes[domain.name]?.VerificationStatus === 'Success') {
				await this.prisma.domain.update({
					where: {
						id: domain.id
					},
					data: {
						status: 'verified'
					}
				});

				domain.status = 'verified';
				result.push(domain);
				continue;
			} else if (verificationAttributes[domain.name]?.VerificationStatus === 'Pending') {
				(domain as any).dnsRecords = await this.prisma.dNSRecord.findMany({
					where: {
						domainId: domain.id,
						deletedAt: {
							isSet: false
						}
					},
					select: {
						id: true,
						name: true,
						value: true,
						type: true,
						ttl: true,
					}
				});
				result.push(domain);
				continue;
			} else {
				await this.prisma.domain.update({
					where: {
						id: domain.id
					},
					data: {
						status: 'failed'
					}
				});

				domain.status = 'failed';
				result.push(domain);
				continue;
			}
		}

		return domains;
	}

}
