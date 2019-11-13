# Kentico Kontent Translation Connector: Azure Functions

This is an [Azure functions](https://azure.microsoft.com/en-us/services/functions/) project designed to enable automated translation for [Kentico Kontent](https://kontent.ai) using   webhooks. It automatically translates all text and rich text elements from the default language into editor selected languages via a companion [custom element](https://github.com/ChristopherJennings/kontent-translation-connector-custom-element).

Features:

- Automatically triggers based on workflow
- Built with TypeScript

## Setup and running locally

1. Before configuring the Azure functions, you need to [configure the companion custom element](https://github.com/ChristopherJennings/kontent-translation-connector-custom-element) as the functions presume that the custom element is present.
1. On your local machine, install the [Azure Functions extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
1. Open the project in VS Code.
1. Copy and rename the [local.settings.template.json](local.settings.template.json) to `local.settings.json`
1. Replace all the `<YOUR_*>` values with your values. Details for each are in the [Environment variables](#environment-variables) section.
1. Run `npm install` to install the necessary NPM packages
1. Hit `F5` (to debug in VS Code) or run `npm start` to build the functions and run locally
   1. You can use a tool like [ngrok](https://ngrok.com/) to pipe requests from Kontent to your local machine
1. The project is now ready to be [configured in Kentico Kontent](#configuring-kentico-kontent)

## Deploying to Azure

This is deployed like any other Azure function project. You can [automate the deployment](https://docs.microsoft.com/en-us/azure/azure-functions/functions-continuous-deployment) or [manually deploy](https://docs.microsoft.com/en-us/azure/javascript/tutorial-vscode-serverless-node-01) with the [Azure Functions extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

## Configuring Kentico Kontent

You'll need to configure two [webhooks](https://docs.kontent.ai/tutorials/develop-apps/integrate/using-webhooks-for-automatic-updates). The project must be [deployed to Azure](#deploying-to-azure) or you must be able to pipe requests to your local machine via a public URL using a tool like [ngrok](https://ngrok.com/). Either way you need a publicly accessible URL for Kontent to be able to send requests to.

### Send for translation webhook

The first webhook is for triggering the actual translation. The `URL address` for this webhook will point to the `TranslationPendingHandler` endpoint in this project. The URL will look something like: `https://<PUBLIC_BASE_DOMAIN>/api/TranslationPendingHandler`.

You also need to configure the `Workflow steps of content items to watch` trigger to a dedicated workflow step designed to trigger the translation connecter. I recommend `Translation pending` as the name, but it could be anything.

### Translation complete webhook

The second webhook is for signaling that a translation has finished and start the next translation. The `URL address` for this webhook will point to the `TranslationReviewHandler` endpoint in this project. The URL will look something like: `https://<PUBLIC_BASE_DOMAIN>/api/TranslationReviewHandler`.

You also need to configure the `Workflow steps of content items to watch` trigger to a dedicated workflow step designed that indicates that a translation is complete and ready for review. I recommend `Translation review` as the name, but it could be anything.

## Environment variables

The project requires a several environment variables to be configured in order for it to work. The below table describes them:

| Name | Value | Description |
| ---- | ----- | ----------- |
KontentProjectId | `<YOUR_PROJECT_ID>` | Your project's ID |
KontentManagementApiKey | `<YOUR_CM_API_KEY>` | Your project's CM API Key. You can get this in Kontent under "Settings > API Keys > Project ID" |
KontentTranslationPendingWorkflowStepId | `<WORKFLOW_GUID>` | The GUID of the workflow step that triggers the translation connector. You can get this using the [retrieve workflow steps](https://docs.kontent.ai/reference/content-management-api-v2#operation/retrieve-workflow-steps) API endpoint. |
KontentTranslationReviewWorkflowStepId | `<WORKFLOW_GUID>` | The GUID of the workflow step that the translation connector puts content items into after it's done. You can get this using the [retrieve workflow steps](https://docs.kontent.ai/reference/content-management-api-v2#operation/retrieve-workflow-steps) API endpoint.|
KontentPublishedWorkflowStepId | `<WORKFLOW_GUID>` | The GUID of the published workflow step. You can get this using the [retrieve workflow steps](https://docs.kontent.ai/reference/content-management-api-v2#operation/retrieve-workflow-steps) API endpoint.|
KontentTranslationSnippetCodename | `<YOUR_TRANSLATION_SNIPPET_CODENAME>` | The codname of the content type snippet you added the custom element to. You can get this in Kontent by going to "Content Models > Content type snippets", opening your content type snippet, and copying the codename from the codename icon in the top right corner of the page.  |
KontentTranslationElementCodename | `<YOUR_TRANSLATION_ELEMENT_CODENAME>` | The codename of the custom element you added. You can get this in Kontent by going to "Content Models > Content type snippets", opening your sontentctype snippet, and copying the codename from the codename icon to the right of your custom element. |
AzureTranslatorTextEndpoint | `https://api.cognitive.microsofttranslator.com/` | This is the base URL for the Azure translation API. You shouldn't need to change this. |
AzureTranslatorTextKey | `<YOUR_AZURE_TRANSLATOR_KEY>` | This is the API key that Azure Translator gives you to make calls to their API. Check out [How to sign up for the Translator Text API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-text-how-to-signup) for more details. |
