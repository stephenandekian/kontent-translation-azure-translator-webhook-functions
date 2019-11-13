export interface Message {
  id: string
  project_id: string
  type: string
  operation: string
  api_name: string
  created_timestamp: Date
  webhook_url: string
}
