export namespace constants {
  export const azureTranslatorTextEndpoint: string = process.env['AzureTranslatorTextEndpoint']
  export const azureTranslatorTextKey: string = process.env['AzureTranslatorTextKey']
  export const kontentDefaultLanguageId: string = '00000000-0000-0000-0000-000000000000'
  export const kontentManagementApiKey: string = process.env['KontentManagementApiKey']
  export const kontentProjectId: string = process.env['KontentProjectId']
  export const kontentTranslationSnippetCodename: string = 'translation'
  export const kontentTranslationElementCodename: string = 'settings'
  export const kontentWorkflowStepIdPublished: string = process.env['KontentPublishedWorkflowStepId']
  export const kontentWorkflowStepIdTranslationPending: string = process.env['KontentTranslationPendingWorkflowStepId']
  export const kontentWorkflowStepIdTranslationReview: string = process.env['KontentTranslationReviewWorkflowStepId']
}
