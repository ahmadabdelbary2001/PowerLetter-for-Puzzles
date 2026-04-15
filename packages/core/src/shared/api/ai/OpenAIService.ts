/**
 * OpenAIService — wrapper around OpenAI Chat Completions API.
 * @see https://platform.openai.com/docs/api-reference/chat
 */
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIOptions {
  messages: OpenAIMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface OpenAIResponse {
  content: string;
  finishReason?: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
}

export class OpenAIService {
  private readonly apiKey: string;
  private readonly defaultModel = 'gpt-4o-mini';
  private readonly endpoint = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(options: OpenAIOptions): Promise<OpenAIResponse> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model ?? this.defaultModel,
        messages: options.messages,
        max_tokens: options.maxTokens ?? 512,
        temperature: options.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    return {
      content: choice?.message?.content ?? '',
      finishReason: choice?.finish_reason,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  /** Generate a hint for a word. */
  async generateHint(word: string, language: 'en' | 'ar' = 'ar'): Promise<string> {
    const systemMsg =
      language === 'ar'
        ? 'أنت مساعد في لعبة ألغاز. أعط تلميحاً قصيراً لكلمة معينة بدون ذكرها.'
        : 'You are a puzzle game assistant. Give a short hint for a word without mentioning it.';

    const result = await this.chat({
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: language === 'ar' ? `الكلمة: "${word}"` : `Word: "${word}"` },
      ],
      maxTokens: 128,
      temperature: 0.9,
    });
    return result.content.trim();
  }
}
