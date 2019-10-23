import {
  ManagementClient,
  LanguageVariantModels,
  ContentTypeModels,
  ContentItemModels
} from '@kentico/kontent-management'
import { constants } from './constants'
import * as Models from '../Models'
import { async } from 'rxjs/internal/scheduler/async'

let client: ManagementClient = initializeClient()

function initializeClient(): ManagementClient {
  return new ManagementClient({
    projectId: constants.kontentProjectId,
    apiKey: constants.kontentManagementApiKey
  })
}

export async function changeWorkflowStep(
  contentItemId: string,
  languageId: string,
  workflowStepId: string
): Promise<void> {
  await client
    .changeWorkflowStepOfLanguageVariant()
    .byItemId(contentItemId)
    .byLanguageId(languageId)
    .byWorkflowStepId(workflowStepId)
    .toPromise()
}

export async function getContentItemById(
  contentItemId: string
): Promise<ContentItemModels.ContentItem> {
  const clientReponse = await client
    .viewContentItem()
    .byItemId(contentItemId)
    .toPromise()

  return clientReponse.data
}

export async function getContentType(
  contentTypeId: string
): Promise<ContentTypeModels.ContentType> {
  const clientResponse = await client
    .viewContentType()
    .byTypeId(contentTypeId)
    .toPromise()

  return clientResponse.data
}

export async function getDefaultLanguageVariant(
  contentItemId: string
): Promise<LanguageVariantModels.ContentItemLanguageVariant> {
  const clientResponse = await client
    .viewLanguageVariant()
    .byItemId(contentItemId)
    .byLanguageId(constants.defaultLanguageId)
    .toPromise()

  return clientResponse.data
}

export async function getTranslationDetails(
  languageVariant: LanguageVariantModels.ContentItemLanguageVariant
): Promise<Models.TranslationDetails> {
  const contentType = await getContentType(languageVariant.item.id)
  const translationElement = getTranslationElement(contentType, languageVariant)
  return translationElement.value as unknown as Models.TranslationDetails
}

export async function upsertLanguageVariant(
  languageVariant: LanguageVariantModels.ContentItemLanguageVariant,
  elements: Array<LanguageVariantModels.ILanguageVariantElement>
) {
  await client.upsertLanguageVariant()
      .byItemId(languageVariant.item.id)
      .byLanguageId(languageVariant.language.id)
      .withElements(elements)
      .toPromise()
}

function getTranslationElement(
  contentType: ContentTypeModels.ContentType,
  languageVariant: LanguageVariantModels.ContentItemLanguageVariant
  ) {
    const translationElementModel = getTranslationElementModel(contentType)
    return languageVariant.elements.find(
      (e) => e.element.id === translationElementModel.id
  )
}

function getTranslationElementModel(
  contentType: ContentTypeModels.ContentType
) {
  return contentType.elements.find(
    (e) => e.codename === constants.translationElementCodename
  )
}
