# traveldex
Multi-lingual encyclopedia for common travel phrases

## Features
1. NextJS app
2. Python scripts that help generate new locales and audio files

## Technical Decision Record (TDR)
1. Why NextJS?
  - Good DX.
  - Optimised builds for SEO, Font, Image etc, given this is a public facing application.
2. Why Python?
  - Simple scripting. GenAI SDK is well written.

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
2. Fill in the `.env` file in `./scripts`, following the `.env.example` file
3. To add new phrases, modify the following:
  - `src/i18n/locales/en.json`. This is the source for all other translations.
  - `scripts/generate_locale.py`. The prompt, to specify the keys to translate. Match this with `src/types/locales.ts`
  - `scripts/json_schema_def.py` to ensure that the generated JSON matches the expected type definition on `src/types/locales.ts`
4. If you are adding an entirely new language, run the translate API first
  - `npm run generate-locale <lang>` e.g. `npm run generate-locale korean`
  - Update `src/i18n/i18n.ts`
  - Update `src/i18n/routing.ts`
5. Generate new audio files for new phrases
  - `npm run generate-audio`