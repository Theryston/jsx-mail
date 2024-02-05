import { Prisma } from "@prisma/client";

export const fileSelect: Prisma.FileSelect = {
	id: true,
	encoding: true,
	mimeType: true,
	originalName: true,
	size: true,
	hash: true
}

export const domainSelect: Prisma.DomainSelect = {
	id: true,
	name: true,
	userId: true,
	status: true,
	dnsRecords: {
		select: {
			id: true,
			name: true,
			value: true,
			type: true,
			ttl: true,
		}
	}
}