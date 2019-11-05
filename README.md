# Kentico Kontent Translation Connector: Azure Functions

This is an [Azure functions](https://azure.microsoft.com/en-us/services/functions/) project designed to enable automated translation for [Kentico Kontent](https://kontent.ai) using   webhooks. It automatically translates all text and rich text elements from the default language into editor selected languages via a companion [custom element](https://github.com/ChristopherJennings/kontent-translation-connector-custom-element).

Features:

- Automatically triggers based on workflow
- Built with TypeScript

## Deploying

This is deployed like any other Azure function project. You can atuomate the deployment or manually deploy with the [Azure Functions extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

### Environment variables

The project requires a large number of environment variables to be configured in order for it to work. The below table describes them:

| Name | Value | Description |
| ---- | ----- | ----------- |
KontentProjectId | `<YOUR_PROJECT_ID>` | Your project's ID |
KontentManagementApiKey | `<YOUR_CM_API_KEY>` | Your project's CM API Key. |
KontentTranslationPendingWorkflowStepId | `<WORKFLOW_GUID>` | The GUID of the workflow step that triggers the translation connector. You can get this using the [retrieve workflow steps](https://docs.kontent.ai/reference/content-management-api-v2#operation/retrieve-workflow-steps) API endpoint. |
KontentTranslationReviewWorkflowStepId | `<WORKFLOW_GUID>` | The GUID of the workflow step that the translation connector puts content items into after it's done. You can get this using the [retrieve workflow steps](https://docs.kontent.ai/reference/content-management-api-v2#operation/retrieve-workflow-steps) API endpoint.|
KontentPublishedWorkflowStepId | `<WORKFLOW_GUID>` | The GUID of the published workflow step. You can get this using the [retrieve workflow steps](https://docs.kontent.ai/reference/content-management-api-v2#operation/retrieve-workflow-steps) API endpoint.|
AzureTranslatorTextEndpoint | `https://api.cognitive.microsofttranslator.com/` | This is the base URL for the Azure translation API. You shouldn't need to change this. |
AzureTranslatorTextKey | `<YOUR_AZURE_TRANSLATOR_KEY>` | This is the API key that Azure Translator gives you to make calls to their API. |

For local debugging/testing you can use a `local.settings.json that looks something like this:

```json
{
  "IsEncrypted": false,
  "Values": {
    "KontentProjectId": "<YOUR_PROJECT_ID>",
    "KontentManagementApiKey": "<YOUR_CM_API_KEY>",
    "KontentTranslationPendingWorkflowStepId":"<WORKFLOW_GUID>",
    "KontentTranslationReviewWorkflowStepId":"<WORKFLOW_GUID>",
    "KontentPublishedWorkflowStepId": "<WORKFLOW_GUID>",
    "AzureTranslatorTextEndpoint": "https://api.cognitive.microsofttranslator.com/",
    "AzureTranslatorTextKey": "<YOUR_AZURE_TRANSLATOR_KEY>"
  }
}
```

For the deployed functions, you can either manually enter these in the Azure portal, or you  use the [Azure Functions extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to upload the local.settings.json configuration to the deployed application by expanding the Function app and right-clicking on "Application Settings" and chosing "Upload local settings".

## Configuring Kentico Kontent

You'll need to configure two [webhooks](https://docs.kontent.ai/tutorials/develop-apps/integrate/using-webhooks-for-automatic-updates).

### Send for translation webhook

The first webhook is for triggering the actual translation. The `URL address` for this webhook will point to the `TranslationPendingHandler` endpoint in this project. That will look something like: `https://your-function-app-name.azurewebsites.net/api/TranslationPendingHandler`. You should also configure the `Workflow steps of content items to watch` trigger to a dedicated workflow step designed to trigger the translation connecter. I recommend `Translation pending` as the name, but it could be anything.

### Translation complete webhook

The second webhook is for signaling that a translation has finished and start the next translation. The `URL address` for this webhook will point to the `TranslationReviewHandler` endpoint in this project. That will look something like: `https://your-function-app-name.azurewebsites.net/api/TranslationReviewHandler`. You should also configure the `Workflow steps of content items to watch` trigger to a dedicated workflow step designed that indicates that a translation is complete and ready for review. I recommend `Translation review` as the name, but it could be anything.
