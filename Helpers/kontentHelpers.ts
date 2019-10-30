import {
  ManagementClient,
  LanguageVariantModels,
  ContentTypeModels,
  ContentItemModels,
  ElementModels,
} from '@kentico/kontent-management'
import { constants } from './constants'
import * as Models from '../Models'
import { async } from 'rxjs/internal/scheduler/async'

let client: ManagementClient = initializeClient()

function initializeClient(): ManagementClient {
  return new ManagementClient({
    projectId: constants.kontentProjectId,
    apiKey: constants.kontentManagementApiKey,
  })
}

export async function changeWorkflowStep(
  contentItemId: string,
  languageId: string,
  workflowStepId: string
): Promise<void> {
  let languageVariant = await getLanguageVariant(contentItemId, languageId)

  const exists = !!languageVariant
  if (exists) {
    const isPublished = languageVariant.workflowStep.id === constants.kontentWorkflowStepIdPublished

    if (isPublished) {
      await client
        .createNewVersionOfLanguageVariant()
        .byItemId(contentItemId)
        .byLanguageId(languageId)
        .toPromise()
    }
  } else {
    const response = await client
      .upsertLanguageVariant()
      .byItemId(contentItemId)
      .byLanguageId(languageId)
      .withElements([])
      .toPromise()
    languageVariant = response.data
  }

  await client
    .changeWorkflowStepOfLanguageVariant()
    .byItemId(contentItemId)
    .byLanguageId(languageId)
    .byWorkflowStepId(workflowStepId)
    .toPromise()
}

export async function getContentItemById(contentItemId: string): Promise<ContentItemModels.ContentItem> {
  const clientReponse = await client
    .viewContentItem()
    .byItemId(contentItemId)
    .toPromise()

  return clientReponse.data
}

export async function getContentType(contentTypeId: string): Promise<ContentTypeModels.ContentType> {
  const clientResponse = await client
    .viewContentType()
    .byTypeId(contentTypeId)
    .toPromise()

  return clientResponse.data
}

export async function getDefaultLanguageVariant(
  contentItemId: string
): Promise<LanguageVariantModels.ContentItemLanguageVariant> {
  return await getLanguageVariant(contentItemId, constants.kontentDefaultLanguageId)
}

export async function getLanguageVariant(
  contentItemId: string,
  languageId: string
): Promise<LanguageVariantModels.ContentItemLanguageVariant> {
  const clientResponse = await client
    .viewLanguageVariant()
    .byItemId(contentItemId)
    .byLanguageId(languageId)
    .toPromise()
    .catch(_reason => {
      return { data: null }
    })

  return clientResponse.data
}

export async function getTranslationDetails(
  languageVariant: LanguageVariantModels.ContentItemLanguageVariant
): Promise<Models.TranslationDetails> {
  const contentItem = await getContentItemById(languageVariant.item.id)
  const contentType = await getContentType(contentItem.type.id)
  const translationElement = await getTranslationElement(contentType, languageVariant)
  return new Models.TranslationDetails(translationElement.value as string)
}

export async function upsertLanguageVariant(
  itemId: string,
  languageId: string,
  elements: Array<LanguageVariantModels.ILanguageVariantElementCodename>
) {
  await client
    .upsertLanguageVariant()
    .byItemId(itemId)
    .byLanguageId(languageId)
    .withElementCodenames(elements)
    .toPromise()
    .catch(reason => {
      console.log(reason)
    })
}

async function getTranslationElement(
  contentType: ContentTypeModels.ContentType,
  languageVariant: LanguageVariantModels.ContentItemLanguageVariant
) {
  const translationElementModel = await getTranslationElementModel(contentType)
  return languageVariant.elements.find(e => e.element.id === translationElementModel.id)
}

async function getTranslationElementModel(contentType: ContentTypeModels.ContentType) {
  const snippetTypeModel = await getSnippetTypeModelByCodename(constants.kontentTranslationSnippetCodename)

  return snippetTypeModel.elements.find(e => {
    return e.codename === constants.kontentTranslationElementCodename
  })
}

async function getSnippetTypeModelByCodename(codename: string): Promise<ContentTypeModels.ContentType> {
  const result = await client
    .viewContentTypeSnippet()
    .byTypeCodename(codename)
    .toPromise()

  return result.data
}
