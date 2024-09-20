import { ClientSecretCredential } from '@azure/identity';

const azureCredential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID as string,
  process.env.AZURE_CLIENT_ID as string,
  process.env.AZURE_CLIENT_SECRET as string,
);

export default azureCredential;
