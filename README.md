# traveldex
Multi-lingual encyclopedia for common travel phrases

## Features
1. NextJS app

## Technical Decision Record (TDR)
1. Why NextJS?
  - Good DX.
  - Optimised builds for SEO, Font, Image etc, given this is a public facing application.
  - Built in API route

## Onboarding for personal development

**Main App**
```
brew install nvm
nvm  install v20.11.1

# Development
cd src; npm install; npm run dev
```

**Generating more languages**

Pre-requisite:
1. Register for a Google Cloud account, enable the Gemini API, get an API key
2. Fill in the `.env` file, following the `.env.example` file
3. To add new phrases, modify the following:
  - `src/i18n/locales/en.json`. This is the source for all other translations.
  - `api/llm/translate/route.ts`. The prompt, to specify the keys to translate. Match this with `src/types/locales.ts`
4. If you are adding an entirely new language, run the translate API first
  - Add the new language to `src/i18n/locales/<lang>.json`
  - Update `src/i18n/i18n.ts` 
  - Update `src/i18n/routing.ts`
5. Once you are satisified with your new locale json file, pass it into the `tts` API (Under development)

POST: localhost:3000/api/llm/translate
```json
{
  targetLanguage: "tamil"
}
```
