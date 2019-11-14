import { HttpRequest } from '@azure/functions'
import * as WebhookModels from '../Models/WebhookModels'
import { Constants } from './constants'

export function isRequestValid(request: HttpRequest): boolean {
  // TODO: Add signature hash check

  const webhookIsValid: boolean =
    request != null &&
    request.body != null &&
    request.body.message != null &&
    request.body.message.operation != null &&
    request.body.message.operation === 'change_workflow_step'

  return webhookIsValid
}

export function getResponse(body: string = 'Ok', status: number = 200): { body: string, status: number } {
  return {
    body,
    status,
  }
}

export function getWorkflowEventItem(request: HttpRequest): WebhookModels.WorkflowEventItem {
  const notification = request.body as WebhookModels.Notification
  return notification.data.items[0]
}

export function isLanguageDefault(languageId: string): boolean {
  return languageId === Constants.kontentDefaultLanguageId
}
