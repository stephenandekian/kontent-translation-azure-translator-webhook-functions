import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { isWebHookValid } from '../Helpers/webhookHelpers'
import { WebhookNotification } from '../Models/WebhookNotification'

const httpTrigger: AzureFunction = async function(
  context: Context,
  request: HttpRequest
): Promise<void> {

  if (isWebHookValid(request)) {
    const notification = request.body as WebhookNotification

    //const defaultLanguageVariant = await getDefaultLanguageVariant(contentItemId)

    //console.log(defaultLanguageVariant)

    // Get default language variant
    // If default language: SUBMIT TRANSLATIONS
    // If not default language: DO TRANSLATION

    // SUBMIT TRANSLATIONS:
    // Reset all languages started/completed timestamps
    // Update all selected languages started timestamps
    // Update Default language variant
    // Get languages to translate to
    // Move all selected language variants into "pending translation" workflow step

    // DO TRANSLATION:
    // Get elements to translate
    // Get translation of elements
    // Update LV
    // Change LV to "translation review" workflow step
    // Update DLV language completed timestamp
    // If all selected languages complete: update DLV to "translation review" workstep


    context.res = {
      // status: 200, /* Defaults to 200 */
      body: 'OK: ' + notification.message.id
    }
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body'
    }
  }
}

export default httpTrigger
