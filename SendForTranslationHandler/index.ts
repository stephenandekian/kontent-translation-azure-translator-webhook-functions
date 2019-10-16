import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { getContentManagementApiClient } from "../Helpers/managementClient"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    if (req.body && req.body.message && req.body.message.id) {
        const client = getContentManagementApiClient()
        var contentItemId = req.body.data.items[0].item.id
        const defaultLanguageVariant = await getDefaultLanguageVariant({ client, contentItemId })
        console.log(defaultLanguageVariant)

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hi " + req.body.message.id
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};

function getDefaultLanguageVariant ({ client, contentItemId }) {
    return new Promise(resolve => {
      client.viewLanguageVariant()
        .byItemId(contentItemId)
        .byLanguageId("00000000-0000-0000-0000-000000000000")
        .toPromise()
        .then(response => {
          resolve(response.data)
        })
    })
  }

  export default httpTrigger