import {
  ManagementClient,
  LanguageVariantModels
} from '@kentico/kontent-management'

let client: ManagementClient = initializeClient()

function initializeClient(): ManagementClient {
  const projectId = process.env['KontentProjectID']
  const apiKey = process.env['KontentManagementApiKey']
  return new ManagementClient({
    projectId,
    apiKey
  })
}

export async function getDefaultLanguageVariant(
  contentItemId: string
): Promise<LanguageVariantModels.ContentItemLanguageVariant> {
  var defaultLanguageVariant = await client
    .viewLanguageVariant()
    .byItemId(contentItemId)
    .byLanguageId('00000000-0000-0000-0000-000000000000')
    .toPromise()

  return defaultLanguageVariant.data
}
