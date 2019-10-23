import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as WebhookHelpers from '../Helpers/webhookHelpers'
import * as WebhookModels from '../Models/WebhookModels'
import { constants } from '../Helpers/constants'

const httpTrigger: AzureFunction = async function(
  context: Context,
  request: HttpRequest
) {
  if (!WebhookHelpers.isRequestValid(request))
    return WebhookHelpers.getResponse('Invalid webhook', 400)

  const notification = request.body as WebhookModels.Notification
  const notificationItem = notification.data.items[0]
  const itemIsDefaultLanguage =
    notificationItem.language.id === constants.defaultLanguageId

  if (!itemIsDefaultLanguage) {
    // Get DLV
    // if last move DLV to review workflow step
    // else move next lang to pending workflow step
  }

  return WebhookHelpers.getResponse()
}

export default httpTrigger
