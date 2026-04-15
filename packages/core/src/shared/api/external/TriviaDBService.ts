/**
 * TriviaDBService — wrapper around Open Trivia Database API.
 * @see https://opentdb.com/api_config.php
 */
export type TriviaCategory = number; // OpenTDB category IDs
export type TriviaDifficulty = 'easy' | 'medium' | 'hard';
export type TriviaType = 'multiple' | 'boolean';

export interface TriviaQuestion {
  category: string;
  type: TriviaType;
  difficulty: TriviaDifficulty;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];
}

export interface TriviaDBOptions {
  amount?: number;
  category?: TriviaCategory;
  difficulty?: TriviaDifficulty;
  type?: TriviaType;
}

export class TriviaDBService {
  private readonly baseUrl = 'https://opentdb.com/api.php';

  async fetchQuestions(options: TriviaDBOptions = {}): Promise<TriviaQuestion[]> {
    const params = new URLSearchParams({
      amount: String(options.amount ?? 10),
      ...(options.category !== undefined ? { category: String(options.category) } : {}),
      ...(options.difficulty ? { difficulty: options.difficulty } : {}),
      ...(options.type ? { type: options.type } : {}),
      encode: 'url3986',
    });

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`TriviaDB error: ${response.status}`);
    }

    const data = await response.json();
    if (data.response_code !== 0) {
      throw new Error(`TriviaDB response_code: ${data.response_code}`);
    }

    return (data.results as any[]).map((q) => {
      const correct = decodeURIComponent(q.correct_answer);
      const incorrect = (q.incorrect_answers as string[]).map(decodeURIComponent);
      const all = [...incorrect, correct].sort(() => Math.random() - 0.5);
      return {
        category: decodeURIComponent(q.category),
        type: q.type as TriviaType,
        difficulty: q.difficulty as TriviaDifficulty,
        question: decodeURIComponent(q.question),
        correctAnswer: correct,
        incorrectAnswers: incorrect,
        allAnswers: all,
      };
    });
  }
}

export const triviaDBService = new TriviaDBService();
