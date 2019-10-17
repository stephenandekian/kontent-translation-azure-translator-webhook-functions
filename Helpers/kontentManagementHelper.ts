import {
  ManagementClient,
  LanguageVariantModels
} from '@kentico/kontent-management'
import { constants } from './constants'

let client: ManagementClient = initializeClient()

function initializeClient(): ManagementClient {
  return new ManagementClient({
    projectId: constants.kontentProjectId,
    apiKey: constants.kontentManagementApiKey
  })
}

export async function getDefaultLanguageVariant(
  contentItemId: string
): Promise<LanguageVariantModels.ContentItemLanguageVariant> {
  var defaultLanguageVariant = await client
    .viewLanguageVariant()
    .byItemId(contentItemId)
    .byLanguageId(constants.defaultLanguageId)
    .toPromise()

  return defaultLanguageVariant.data
}
