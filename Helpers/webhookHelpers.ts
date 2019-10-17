import { WebhookNotification } from '../Models/WebhookNotification'

export function isWebHookValid(request: any): boolean {
  const webhookIsValid: boolean =
    request != null &&
    request.body != null &&
    request.body.message != null &&
    request.body.message.id != null

  return webhookIsValid
}
