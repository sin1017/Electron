import { TranslationServiceClient } from '@google-cloud/translate';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Instantiates a client
const translationClient = new TranslationServiceClient({
  keyFilename: resolve(__dirname, '../../translation-tool.json')
});

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
  if (response.translations) {
    for (const translation of response.translations) {
      console.log(`Translation: ${translation.translatedText}`);
    }
  }
}

