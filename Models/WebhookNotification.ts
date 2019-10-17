import { ContentItemModels } from '@kentico/kontent-management'

export type WebhookData = {
  items: [ContentItemModels.ContentItem]
}

export type WebHookMessage = {
  id: string
  project_id: string
  type: string
  operation: string
  api_name: string
  created_timestamp: Date
  webhook_url: string
}

export class WebhookNotification {
  data: WebhookData
  message: WebHookMessage
}
