import { LanguageDetails } from '.'

export class TranslationDetails {
  selectedLanguages: Array<LanguageDetails>

  constructor(raw: string) {
    const value = JSON.parse(raw) as TranslationDetails
    this.selectedLanguages = value.selectedLanguages
  }
}
