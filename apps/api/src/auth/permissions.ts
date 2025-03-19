type Permission = {
  title: string;
  value: string;
  description: string;
  ignoreList?: boolean;
};

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
  SELF_SEND_EMAIL: {
    title: 'Self Send Email',
    value: 'self:send-email',
    description: 'Can send emails using your own senders',
  },
  SELF_EMAIL_VALIDATE: {
    title: 'Self Email Validate',
    value: 'self:email-validate',
    description: 'Can validate its own email',
    ignoreList: true,
  },
  SELF_RESET_PASSWORD: {
    title: 'Self Reset Password',
    value: 'self:reset-password',
    description: 'Can reset its own password',
    ignoreList: true,
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
  SELF_FILE_UPLOAD: {
    title: 'Self File Upload',
    value: 'self:file-upload',
    description: 'Can upload files for itself',
  },
  SELF_FILE_DELETE: {
    title: 'Self File Delete',
    value: 'self:file-delete',
    description: 'Can delete files for itself',
  },
  SELF_LIST_FILES: {
    title: 'Self List Files',
    value: 'self:list-files',
    description: 'Can list files for itself',
  },
  SELF_LIST_MESSAGES: {
    title: 'Self List Messages',
    value: 'self:list-messages',
    description: 'Can list messages for itself',
  },
  SELF_CREATE_SENDER: {
    title: 'Self Create Sender',
    value: 'self:create-sender',
    description: 'Can create senders for itself',
  },
  SELF_DELETE_SENDER: {
    title: 'Self Delete Sender',
    value: 'self:delete-sender',
    description: 'Can delete senders for itself',
  },
  SELF_LIST_SENDERS: {
    title: 'Self List Senders',
    value: 'self:list-senders',
    description: 'Can list senders for itself',
  },
  SELF_SEND_EMAIL_WITH_ATTACHMENTS: {
    title: 'Self Send Email With Attachments',
    value: 'self:send-email-with-attachments',
    description: 'Can send emails with attachments using your own senders',
    ignoreList: true,
  },
  SELF_SESSION_CREATE: {
    title: 'Self Session Create',
    value: 'self:session-create',
    description: 'Can create a session for itself',
  },
  SELF_LIST_SESSIONS: {
    title: 'Self List Sessions',
    value: 'self:list-sessions',
    description: 'Can list it owns sessions',
  },
  SELF_GET_BALANCE: {
    title: 'Self Get Balance',
    value: 'self:get-balance',
    description: 'Can get its own balance',
  },
  SELF_LIST_TRANSACTIONS: {
    title: 'Self List Transactions',
    value: 'self:list-transactions',
    description: 'Can list it owns transactions',
  },
  SELF_CREATE_CHECKOUT: {
    title: 'Self Create Checkout',
    value: 'self:create-checkout',
    description: 'Can create a checkout for itself',
  },
  SELF_GET_INSIGHTS: {
    title: 'Self Get Insights',
    value: 'self:get-insights',
    description: 'Can get its own insights',
  },
  OTHER_RUN_WORKERS: {
    title: 'Other Run Workers',
    value: 'other:run-workers',
    description: 'Can run workers',
  },
  SELF_UPDATE: {
    title: 'Self Update',
    value: 'self:update',
    description: 'Can update itself',
  },
  SELF_MESSAGES_INSIGHT: {
    title: 'Self Messages Insight',
    value: 'self:messages-insight',
    description: 'Can get messages insights',
  },
  SELF_DOMAIN_VERIFY: {
    title: 'Self Domain Verify',
    value: 'self:domain-verify',
    description: 'Can verify check a domain verification status',
  },
  SELF_UPDATE_ONBOARDING: {
    title: 'Self Update Onboarding',
    value: 'self:update-onboarding',
    description: 'Can update its own onboarding',
    ignoreList: true,
  },
  OTHER_GET_USERS: {
    title: 'Admin Get Users',
    value: 'other:get-users',
    description: 'Can get all users',
  },
  OTHER_IMPERSONATE_USER: {
    title: 'Other Impersonate User',
    value: 'other:impersonate-user',
    description: 'Can impersonate a user',
  },
};
