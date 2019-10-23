import { HttpRequest } from '@azure/functions'
import * as WebhookModels from '../Models/WebhookModels'

export function isRequestValid(request: HttpRequest): boolean {
  // TODO: Add signature hash check

  const webhookIsValid: boolean =
    request != null &&
    request.body != null &&
    request.body.message != null &&
    request.body.message.id != null

  return webhookIsValid
}

export function getResponse(body: string = 'Ok', status: number = 200) {
  return {
    status,
    body
  }
}

export function getWorkflowEventItem(
  request: HttpRequest
): WebhookModels.WorkflowEventItem {
  const notification = request.body as WebhookModels.Notification
  return notification.data.items[0]
}