import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as WebhookHelpers from '../Helpers/webhookHelpers'
import { constants } from '../Helpers/constants'
import * as KontentHelpers from '../Helpers/kontentHelpers'
import { LanguageVariantModels } from '@kentico/kontent-management'

const httpTrigger: AzureFunction = async function(
  context: Context,
  request: HttpRequest
) {
  if (!WebhookHelpers.isRequestValid(request))
    return WebhookHelpers.getResponse('Invalid webhook', 400)

  const workflowEventItem = WebhookHelpers.getWorkflowEventItem(request)
  const defaultLanguageVariant = await KontentHelpers.getDefaultLanguageVariant(
    workflowEventItem.item.id
  )

  if (WebhookHelpers.isLanguageDefault(workflowEventItem.language.id)) {
    await startNewTranslation(defaultLanguageVariant)
    return WebhookHelpers.getResponse('New translation job started')
  } else {
    await translateLanguageVariant(defaultLanguageVariant)
    return WebhookHelpers.getResponse(
      `Language translated: ${workflowEventItem.language.id}`
    )
  }
}

async function startNewTranslation(
  defaultLanguageVariant: LanguageVariantModels.ContentItemLanguageVariant
) {
  // Clear translation timestamps
  await clearTranslationTimestamps(defaultLanguageVariant)

  // Change first language to pending
  // await KontentHelpers.changeWorkflowStep(
  //   defaultLanguageVariant.item.id,
  //   defaultLanguageVariant.language.id,
  //   constants.kontentTranslationPendingWorkflowStepId
  // )
}

async function clearTranslationTimestamps(
  defaultLanguageVariant: LanguageVariantModels.ContentItemLanguageVariant
) {
  const t9nDetails = await KontentHelpers.getTranslationDetails(
    defaultLanguageVariant
  )

  t9nDetails.selectedLanguages = t9nDetails.selectedLanguages.map(
    (language) => {
      return {
        ...language,
        started: null,
        completed: null
      }
    }
  )

  const t9nElement = {
    element: { codename: constants.translationElementCodename },
    value: JSON.stringify(t9nDetails)
  }

  await KontentHelpers.upsertLanguageVariant(defaultLanguageVariant, [
    t9nElement
  ])
}

async function translateLanguageVariant(
  defaultLanguageVariant: LanguageVariantModels.ContentItemLanguageVariant
): Promise<void> {
  // Set language started timestamp in DLV
  // Get elements to translate from DLV
  // Translate element values
  // Set LV element values
  // Upsert LV to save translation
  // Change LV WF to "review"
  // Set language completed timestamp in DLV
  // Upsert DLV to save LV timestamps
}

export default httpTrigger
