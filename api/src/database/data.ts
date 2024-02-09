import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const hashPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt);

const user: Prisma.UserCreateInput = {
	email: 'jsxmailorg@gmail.com',
	name: 'JSX Mail',
	password: hashPassword,
	isEmailVerified: true,
	accessLevel: 'other',
}

const domain: Prisma.DomainCreateInput = {
	name: 'jsxmail.org',
	status: 'verified',
	user: {
		connect: {
			email: 'jsxmailorg@gmail.com'
		}
	},
}

const data = [
	{
		modelName: 'user',
		data: user,
		uniqueField: 'email'
	},
	{
		modelName: 'domain',
		data: domain,
		uniqueField: 'name'
	}
]

export default data