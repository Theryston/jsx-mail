type Permission = {
	title: string;
	value: string;
	description: string;
}

export const PERMISSIONS: {
	[key: string]: Permission;
} = {
	OTHER_ADMIN: {
		title: 'Other Admin',
		value: 'other:admin',
		description: 'Can perform any action on any user',
	},
	SELF_ADMIN: {
		title: 'Self Admin',
		value: 'self:admin',
		description: 'Can perform any action on itself',
	},
	SELF_REQUEST_EMAIL_CODE: {
		title: 'Self Request Email Code',
		value: 'self:request-email-code',
		description: 'Can request a new email code',
	},
	SELF_VALIDATE_EMAIL_CODE: {
		title: 'Self Validate Email Code',
		value: 'self:validate-email-code',
		description: 'Can validate an email code',
	}
}

export const PRIVATE_ROUTES_CAN_BE_USED_NOT_EMAIL_VERIFIED = [
	'/user/validate-email',
	'/user/request-email-code',
]