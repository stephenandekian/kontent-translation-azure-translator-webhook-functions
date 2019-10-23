export namespace constants {
  export const defaultLanguageId: string = '00000000-0000-0000-0000-000000000000'
  export const kontentProjectId: string = process.env['KontentProjectId']
  export const translationElementCodename: string = 'translation__settings'
  export const kontentManagementApiKey: string =
    process.env['KontentManagementApiKey']
  export const kontentTranslationPendingWorkflowStepId: string =
    process.env['KontentTranslationPendingWorkflowStepId']
  export const kontentTranslationReviewWorkflowStepId: string =
    process.env['KontentTranslationReviewWorkflowStepId']
}
