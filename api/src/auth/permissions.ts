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
	SELF_EMAIL_VALIDATE: {
		title: 'Self Email Validate',
		value: 'self:email-validate',
		description: 'Can validate its own email',
	}
}