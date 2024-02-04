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
	},
	SELF_RESET_PASSWORD: {
		title: 'Self Reset Password',
		value: 'self:reset-password',
		description: 'Can reset its own password',
	},
	SELF_GET: {
		title: 'Self Get',
		value: 'self:get',
		description: 'Can get its own data',
	},
	SELF_SESSION_DELETE: {
		title: 'Self Session Delete',
		value: 'self:session-delete',
		description: 'Can delete its own session',
	},
	SELF_DOMAIN_CREATE: {
		title: 'Self Domain Create',
		value: 'self:domain-create',
		description: 'Can create a domain for itself',
	},
	SELF_DOMAIN_DELETE: {
		title: 'Self Domain Delete',
		value: 'self:domain-delete',
		description: 'Can delete a domain for itself',
	},
	SELF_LIST_DOMAINS: {
		title: 'Self List Domains',
		value: 'self:list-domains',
		description: 'Can list domains for itself',
	},
}