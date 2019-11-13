import { LanguageDetails } from './languageDetails'

export class TranslationDetails {
  public selectedLanguages: LanguageDetails[]

  constructor(raw: string) {
    const value = JSON.parse(raw) as TranslationDetails
    this.selectedLanguages = value.selectedLanguages
  }
}
