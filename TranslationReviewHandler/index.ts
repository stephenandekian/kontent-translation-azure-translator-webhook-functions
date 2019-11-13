import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as WebhookHelpers from '../Helpers/webhookHelpers'
import * as KontentHelpers from '../Helpers/kontentHelpers'
import { constants } from '../Helpers/constants'

const httpTrigger: AzureFunction = async function(context: Context, request: HttpRequest) {
  if (!WebhookHelpers.isRequestValid(request)) return WebhookHelpers.getResponse('Invalid webhook. Not from Kontent or trigger is not a workflow step change', 400)

  const workflowEventItem = WebhookHelpers.getWorkflowEventItem(request)

  if (!WebhookHelpers.isLanguageDefault(workflowEventItem.language.id)) {
    // Get basic data needed to do everything
    const defaultLanguageVariant = await KontentHelpers.getDefaultLanguageVariant(workflowEventItem.item.id)
    let t9nDetails = await KontentHelpers.getTranslationDetails(defaultLanguageVariant)

    // Set language completed timestamp in DLV
    KontentHelpers.updateTimestamp(t9nDetails, workflowEventItem.language.id, 'completed')
    await KontentHelpers.updateTranslationDetails(t9nDetails,defaultLanguageVariant)

    // if there's another language move it to pending WF step
    const nextLanguage = KontentHelpers.getNextLanguage(t9nDetails)
    if(nextLanguage) {
      await KontentHelpers.changeWorkflowStep(workflowEventItem.item.id, nextLanguage.id, constants.kontentWorkflowStepIdTranslationPending)
    } else {
      // else move DLV to review workflow step
      await KontentHelpers.changeWorkflowStep(workflowEventItem.item.id, constants.kontentDefaultLanguageId, constants.kontentWorkflowStepIdTranslationReview)
    }
  }

  return WebhookHelpers.getResponse()
}

export default httpTrigger
