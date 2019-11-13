import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { ElementModels, LanguageVariantModels } from '@kentico/kontent-management'
import { Constants } from '../Helpers/constants'
import * as KontentHelpers from '../Helpers/kontentHelpers'
import * as TranslationHelper from '../Helpers/translationHelper'
import * as WebhookHelpers from '../Helpers/webhookHelpers'
import * as Models from '../Models'

// We don't want to break Azure's template, so we're disabling the only-arrow-functions rule
// tslint:disable-next-line: only-arrow-functions
const httpTrigger: AzureFunction = async function(context: Context, request: HttpRequest) {
  if (!WebhookHelpers.isRequestValid(request)) {
    return WebhookHelpers.getResponse('Invalid webhook. Not from Kontent or trigger is not a workflow step change', 400)
  }

  const workflowEventItem = WebhookHelpers.getWorkflowEventItem(request)
  const defaultLanguageVariant = await KontentHelpers.getDefaultLanguageVariant(workflowEventItem.item.id)

  if (WebhookHelpers.isLanguageDefault(workflowEventItem.language.id)) {
    await startNewTranslation(defaultLanguageVariant)
    return WebhookHelpers.getResponse('New translation job started')
  } else {
    await translateLanguageVariant(defaultLanguageVariant, workflowEventItem.language.id)
    return WebhookHelpers.getResponse(`Language translated: ${workflowEventItem.language.id}`)
  }
}

async function startNewTranslation(defaultLanguageVariant: LanguageVariantModels.ContentItemLanguageVariant) {
  const t9nDetails = await KontentHelpers.getTranslationDetails(defaultLanguageVariant)

  // Clear translation timestamps
  await clearTranslationTimestamps(defaultLanguageVariant, t9nDetails)

  const firstLanguage = t9nDetails.selectedLanguages.length > 0 ? t9nDetails.selectedLanguages[0] : null

  if (!firstLanguage) {
    return
  }

  await KontentHelpers.changeWorkflowStep(
    defaultLanguageVariant.item.id,
    firstLanguage.id,
    Constants.kontentWorkflowStepIdTranslationPending
  )
}

async function clearTranslationTimestamps(
  defaultLanguageVariant: LanguageVariantModels.ContentItemLanguageVariant,
  t9nDetails: Models.TranslationDetails
) {
  t9nDetails.selectedLanguages = t9nDetails.selectedLanguages.map(language => {
    return {
      ...language,
      completed: null,
      started: null,
    }
  })

  await KontentHelpers.updateTranslationDetails(t9nDetails, defaultLanguageVariant)
}

async function translateLanguageVariant(
  defaultLanguageVariant: LanguageVariantModels.ContentItemLanguageVariant,
  currentLanguageId: string
): Promise<void> {
  const t9nDetails = await KontentHelpers.getTranslationDetails(defaultLanguageVariant)
  const currentLanguage = t9nDetails.selectedLanguages.find(language => language.id === currentLanguageId)

  // Set language started timestamp in DLV
  KontentHelpers.updateTimestamp(t9nDetails, currentLanguageId, 'started')

  // Upsert DLV to save LV timestamps
  await KontentHelpers.updateTranslationDetails(t9nDetails, defaultLanguageVariant)

  // Get elements to translate from DLV
  const contentItem = await KontentHelpers.getContentItemById(defaultLanguageVariant.item.id)
  const contentType = await KontentHelpers.getContentType(contentItem.type.id)
  const translatableElementIds = getTranslatableElementIds(contentType.elements)
  const translatableElementValues = getTranslatableElementValues(
    defaultLanguageVariant.elements,
    translatableElementIds
  )

  // Translate element values
  const translatedElementValues = await TranslationHelper.translate(translatableElementValues, currentLanguage.codename)

  // Combine the translated and untranslated element values
  const untranslatedElementValues = getUntranslatableElementValues(
    defaultLanguageVariant.elements,
    translatableElementIds
  )
  const elementValuesCombined = [...translatedElementValues, ...untranslatedElementValues]

  // Upsert LV to save translation
  await KontentHelpers.upsertLanguageVariant(
    defaultLanguageVariant.item.id,
    currentLanguageId,
    elementValuesCombined as LanguageVariantModels.ILanguageVariantElement[]
  )

  // Change LV WF to "review"
  await KontentHelpers.changeWorkflowStep(
    defaultLanguageVariant.item.id,
    currentLanguageId,
    Constants.kontentWorkflowStepIdTranslationReview
  )
}

function getTranslatableElementIds(elements: ElementModels.ElementModel[]): string[] {
  return elements.filter(element => element.type === 'text' || element.type === 'rich_text').map(element => element.id)
}

function getTranslatableElementValues(
  elementValues: ElementModels.ContentItemElement[],
  elementIds: string[]
): ElementModels.ContentItemElement[] {
  return elementValues.filter(element => elementIds.includes(element.element.id))
}

function getUntranslatableElementValues(
  elementValues: ElementModels.ContentItemElement[],
  elementIds: string[]
): ElementModels.ContentItemElement[] {
  return elementValues.filter(element => !elementIds.includes(element.element.id))
}

export default httpTrigger
