import { AzureAuthorityHosts, ClientSecretCredential } from '@azure/identity';

/* eslint-disable turbo/no-undeclared-env-vars */
const azureCredential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID as string,
  process.env.AZURE_CLIENT_ID as string,
  process.env.AZURE_CLIENT_SECRET as string,
  {
    authorityHost: AzureAuthorityHosts.AzureGovernment,
  },
);

export default azureCredential;
