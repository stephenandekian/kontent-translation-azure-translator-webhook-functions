import { constants } from '../../Helpers/constants'

export class WorkflowEventItem {
  item: { id: string }
  language: { id: string }
  transition_from: { id: string }
  transition_to: { id: string }
  languageIsDefault(): boolean {
    return this.language.id === constants.defaultLanguageId
  }
}
