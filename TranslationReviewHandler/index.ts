import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as WebhookHelpers from '../Helpers/webhookHelpers'

const httpTrigger: AzureFunction = async function(context: Context, request: HttpRequest) {
  if (!WebhookHelpers.isRequestValid(request)) return WebhookHelpers.getResponse('Invalid webhook', 400)

  const workflowEventItem = WebhookHelpers.getWorkflowEventItem(request)

  if (!WebhookHelpers.isLanguageDefault(workflowEventItem.language.id)) {
    // Get DLV
    // if last move DLV to review workflow step
    // else move next lang to pending workflow step
  }

  return WebhookHelpers.getResponse()
}

export default httpTrigger
