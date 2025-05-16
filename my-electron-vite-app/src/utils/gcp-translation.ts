import { TranslationServiceClient } from '@google-cloud/translate';

// Instantiates a client
const translationClient = new TranslationServiceClient();

const projectId = 'translation-tool-457910';
const location_ = 'global';
const text = 'Hello, world!';

export async function translateText() {
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location_}`,
    contents: [text],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'en',
    targetLanguageCode: 'zh',
  };

  // Run request
  const [response] = await translationClient.translateText(request);

  for (const translation of response.translations) {
    console.log(`Translation: ${translation.translatedText}`);
  }
}

