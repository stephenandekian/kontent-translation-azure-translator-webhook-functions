/* eslint-disable no-console */
import axios from "axios";
import { ElementModels } from "@kentico/kontent-management";
import { constants } from "./constants";

export async function translate(
  elementValues: ElementModels.ContentItemElement[],
  languageCodename: string
): Promise<ElementModels.ContentItemElement[]> {
  return await translateWithAzure(elementValues, languageCodename);
}

async function translateWithAzure(
  elementValues: ElementModels.ContentItemElement[],
  languageCodename: string
): Promise<ElementModels.ContentItemElement[]> {
  const key = constants.azureTranslatorTextKey;
  const endpoint = constants.azureTranslatorTextEndpoint;

  const translatorTextData = elementValues.map(element => ({
    text: element.value
  }));
  let translatorTextUrl = `${endpoint}translate?api-version=3.0&textType=html&from=en&to=${languageCodename}`;

  const response = await axios.post(translatorTextUrl, translatorTextData, {
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/json"
    }
  });
  elementValues.forEach((element, index) => {
    element.value = response.data[index].translations[0].text.replace(
      /<br>/g,
      "<br/>"
    );
  });

  return elementValues;
}
