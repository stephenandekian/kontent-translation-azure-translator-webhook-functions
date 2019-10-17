import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { isWebHookValid } from '../Helpers/webhookHelpers'
import * as WebhookModels from '../Models/WebhookModels'
import * as KontentManagementHelper from '../Helpers/kontentManagementHelper'
import { constants } from '../Helpers/constants'
import { async } from 'rxjs/internal/scheduler/async'

const httpTrigger: AzureFunction = async function(
  context: Context,
  request: HttpRequest
) {

  if (!isWebHookValid(request)) {
    context.res = {
      status: 400,
      body: 'Invalid webhook'
    }
    return
  }

  const notification = request.body as WebhookModels.Notification
  const notificationItem = notification.data.items[0]

  if (notificationItem.language.id === constants.defaultLanguageId) {
    context.res = {
      body: 'Translation started'
    }
    await startTranslations(notificationItem)
  } else {
    context.res = {
      body: 'Translated language item'
    }
    await translateItem(notificationItem)
  }
}

async function startTranslations(item: WebhookModels.Item): Promise<void> {
  // SUBMIT TRANSLATIONS:
  // Reset all languages started/completed timestamps
  // Update all selected languages started timestamps
  // Update Default language variant
  // Get languages to translate to
  // Move all selected language variants into "pending translation" workflow step
}

async function translateItem(item: WebhookModels.Item): Promise<void> {
  // DO TRANSLATION:
  // Get elements to translate
  // Get translation of elements
  // Update LV
  // Change LV to "translation review" workflow step
  // Update DLV language completed timestamp
  // If all selected languages complete: update DLV to "translation review" workstep
}

function updateResponse(context: Context, body: string, status: number = 200) {
  context.res = {
    status,
    body
  }
}

export default httpTrigger
