export class Constants {
  public static readonly azureTranslatorTextEndpoint?: string = process.env.AzureTranslatorTextEndpoint
  public static readonly azureTranslatorTextKey?: string = process.env.AzureTranslatorTextKey
  public static readonly kontentDefaultLanguageId: string = '00000000-0000-0000-0000-000000000000'
  public static readonly kontentManagementApiKey?: string = process.env.KontentManagementApiKey
  public static readonly kontentProjectId?: string = process.env.KontentProjectId
  public static readonly kontentTranslationSnippetCodename?: string = process.env.KontentTranslationSnippetCodename
  public static readonly kontentTranslationElementCodename?: string = process.env.KontentTranslationElementCodename
  public static readonly kontentWorkflowStepIdPublished?: string = process.env.KontentPublishedWorkflowStepId
  public static readonly kontentWorkflowStepIdTranslationPending?: string =
    process.env.KontentTranslationPendingWorkflowStepId
  public static readonly kontentWorkflowStepIdTranslationReview?: string =
    process.env.KontentTranslationReviewWorkflowStepId
}
