export interface WorkflowEventItem {
  item: { id: string }
  language: { id: string }
  transition_from: { id: string }
  transition_to: { id: string }
}
