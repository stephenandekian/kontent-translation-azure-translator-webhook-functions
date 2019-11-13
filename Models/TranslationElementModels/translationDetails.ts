import { LanguageDetails } from '.'

export class TranslationDetails {
  public selectedLanguages: LanguageDetails[]

  constructor(raw: string) {
    const value = JSON.parse(raw) as TranslationDetails
    this.selectedLanguages = value.selectedLanguages
  }
}
