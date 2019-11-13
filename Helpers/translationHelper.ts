/* eslint-disable no-console */
import { ElementModels } from '@kentico/kontent-management'
import axios from 'axios'
import { Constants } from './constants'

export async function translate(
  elementValues: ElementModels.ContentItemElement[],
  languageCodename: string
): Promise<ElementModels.ContentItemElement[]> {
  return await translateWithAzure(elementValues, languageCodename)
}

async function translateWithAzure(
  elementValues: ElementModels.ContentItemElement[],
  languageCodename: string
): Promise<ElementModels.ContentItemElement[]> {
  const key = Constants.azureTranslatorTextKey
  const endpoint = Constants.azureTranslatorTextEndpoint

  const translatorTextData = elementValues.map(element => ({
    text: element.value,
  }))
  const translatorTextUrl = `${endpoint}translate?api-version=3.0&textType=html&from=en&to=${languageCodename}`

  const response = await axios.post(translatorTextUrl, translatorTextData, {
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': key,
    },
  })
  elementValues.forEach((element, index) => {
    element.value = response.data[index].translations[0].text.replace(/<br>/g, '<br/>')
  })

  return elementValues
}
