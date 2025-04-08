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
  SELF_CREATE_CONTACT_GROUP: {
    title: 'Self Create Contact Group',
    value: 'self:create-contact-group',
    description: 'Can create a contact group for itself',
  },
  SELF_LIST_CONTACT_GROUPS: {
    title: 'Self List Contact Groups',
    value: 'self:list-contact-groups',
    description: 'Can list contact groups for itself',
  },
  SELF_DELETE_CONTACT_GROUP: {
    title: 'Self Delete Contact Group',
    value: 'self:delete-contact-group',
    description: 'Can delete a contact group for itself',
  },
  SELF_GET_CONTACT_GROUP: {
    title: 'Self Get Contact Group',
    value: 'self:get-contact-group',
    description: 'Can get a contact group for itself',
  },
  SELF_GET_CONTACT_GROUP_CONTACTS: {
    title: 'Self Get Contact Group Contacts',
    value: 'self:get-contact-group-contacts',
    description: 'Can get contacts for a contact group for itself',
  },
  SELF_DELETE_CONTACT_GROUP_CONTACTS: {
    title: 'Self Delete Contact Group Contacts',
    value: 'self:delete-contact-group-contacts',
    description: 'Can delete contacts from a contact group for itself',
  },
  SELF_CREATE_CONTACT_IMPORT: {
    title: 'Self Create Contact Import',
    value: 'self:create-contact-import',
    description: 'Can create a contact import for itself',
  },
  SELF_GET_CONTACT_IMPORT: {
    title: 'Self Get Contact Import',
    value: 'self:get-contact-import',
    description: 'Can get a contact import for itself',
  },
  SELF_MARK_CONTACT_IMPORT_AS_READ: {
    title: 'Self Mark Contact Import As Read',
    value: 'self:mark-contact-import-as-read',
    description: 'Can mark a contact import as read',
  },
  SELF_GET_CONTACT_IMPORT_FAILURES: {
    title: 'Self Get Contact Import Failures',
    value: 'self:get-contact-import-failures',
    description: 'Can get contact import failures for itself',
  },
  SELF_CREATE_BULK_SENDING: {
    title: 'Self Create Bulk Sending',
    value: 'self:create-bulk-sending',
    description: 'Can create a bulk sending for itself',
  },
  SELF_LIST_BULK_SENDINGS: {
    title: 'Self List Bulk Sendings',
    value: 'self:list-bulk-sendings',
    description: 'Can list bulk sendings for itself',
  },
  SELF_GET_BULK_SENDING_FAILURES: {
    title: 'Self Get Bulk Sending Failures',
    value: 'self:get-bulk-sending-failures',
    description: 'Can get bulk sending failures for itself',
  },
  SELF_CREATE_CONTACT_GROUP_CONTACTS: {
    title: 'Self Create Contact Group Contacts',
    value: 'self:create-contact-group-contacts',
    description: 'Can create contacts for a contact group for itself',
  },
  OTHER_BLOCK_PERMISSION: {
    title: 'Other Block Permission',
    value: 'other:block-permission',
    description: 'Can block a permission for a user',
  },
  SELF_GET_MESSAGE: {
    title: 'Self Get Message',
    value: 'self:get-message',
    description: 'Can get a message for itself',
  },
  OTHER_GET_DEFAULT_SETTINGS: {
    title: 'Other Get Default Settings',
    value: 'other:get-default-settings',
    description: 'Can get default settings',
  },
  OTHER_UPDATE_DEFAULT_SETTINGS: {
    title: 'Other Update Default Settings',
    value: 'other:update-default-settings',
    description: 'Can update default settings',
  },
  OTHER_GET_USER_SETTINGS: {
    title: 'Other Get User Settings',
    value: 'other:get-user-settings',
    description: 'Can get user settings',
  },
  OTHER_UPDATE_USER_SETTINGS: {
    title: 'Other Update User Settings',
    value: 'other:update-user-settings',
    description: 'Can update user settings',
  },
  OTHER_DELETE_USER_SETTINGS: {
    title: 'Other Delete User Settings',
    value: 'other:delete-user-settings',
    description: 'Can delete user settings',
  },
  SELF_CREATE_BULK_EMAIL_CHECK: {
    title: 'Self Create Bulk Email Check',
    value: 'self:create-bulk-email-check',
    description: 'Can create a bulk email check for itself',
  },
  SELF_LIST_BULK_EMAIL_CHECKS: {
    title: 'Self List Bulk Email Checks',
    value: 'self:list-bulk-email-checks',
    description: 'Can list bulk email checks for itself',
  },
  SELF_CREATE_BULK_EMAIL_CHECK_ESTIMATE: {
    title: 'Self Create Bulk Email Check Estimate',
    value: 'self:create-bulk-email-check-estimate',
    description: 'Can create a bulk email check estimate for itself',
  },
  SELF_MARK_BULK_EMAIL_CHECK_AS_READ: {
    title: 'Self Mark Bulk Email Check As Read',
    value: 'self:mark-bulk-email-check-as-read',
    description: 'Can mark a bulk email check as read for itself',
  },
};
