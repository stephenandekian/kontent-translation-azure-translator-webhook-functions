import { ManagementClient } from '@kentico/kontent-management';

export function getContentManagementApiClient () {
  const projectId = process.env["KontentProjectID"]
  const apiKey = process.env["KontentManagementApiKey"]
  return new ManagementClient({
    projectId,
    apiKey,
  })
}