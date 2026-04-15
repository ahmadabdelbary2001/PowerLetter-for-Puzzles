/**
 * GeminiService — wrapper around Google Gemini API.
 * @see https://ai.google.dev/api/rest
 */
export interface GeminiGenerateOptions {
  prompt: string;
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
}

export interface GeminiResponse {
  text: string;
  finishReason?: string;
}

export class GeminiService {
  private readonly apiKey: string;
  private readonly defaultModel = 'gemini-1.5-flash';
  private readonly endpoint = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(options: GeminiGenerateOptions): Promise<GeminiResponse> {
    const model = options.model ?? this.defaultModel;
    const url = `${this.endpoint}/${model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: options.prompt }] }],
        generationConfig: {
          maxOutputTokens: options.maxOutputTokens ?? 1024,
          temperature: options.temperature ?? 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const finishReason: string =
      data?.candidates?.[0]?.finishReason ?? 'UNKNOWN';

    return { text, finishReason };
  }

  /** Generate a hint for a given puzzle word. */
  async generateHint(word: string, language: 'en' | 'ar' = 'ar'): Promise<string> {
    const prompt =
      language === 'ar'
        ? `أعطني تلميحاً واحداً قصيراً للكلمة "${word}" بدون ذكر الكلمة نفسها، باللغة العربية.`
        : `Give me one short hint for the word "${word}" without mentioning the word itself, in English.`;

    const result = await this.generate({ prompt, maxOutputTokens: 128, temperature: 0.9 });
    return result.text.trim();
  }
}
