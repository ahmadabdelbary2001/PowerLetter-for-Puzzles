/**
 * PexelsService — wrapper around Pexels Photos API.
 * @see https://www.pexels.com/api/documentation/
 */
export interface PexelsPhoto {
  id: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    thumbnail: string;
  };
  alt?: string;
}

export interface PexelsSearchOptions {
  query: string;
  perPage?: number;
  page?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  locale?: string;
}

export class PexelsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.pexels.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(options: PexelsSearchOptions): Promise<PexelsPhoto[]> {
    const params = new URLSearchParams({
      query: options.query,
      per_page: String(options.perPage ?? 10),
      page: String(options.page ?? 1),
      ...(options.orientation ? { orientation: options.orientation } : {}),
      ...(options.locale ? { locale: options.locale } : {}),
    });

    const response = await fetch(`${this.baseUrl}/search?${params}`, {
      headers: { Authorization: this.apiKey },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    return (data.photos as any[]).map((p) => ({
      id: p.id,
      url: p.url,
      photographer: p.photographer,
      src: p.src,
      alt: p.alt,
    }));
  }

  async getPhoto(id: number): Promise<PexelsPhoto | null> {
    const response = await fetch(`${this.baseUrl}/photos/${id}`, {
      headers: { Authorization: this.apiKey },
    });
    if (!response.ok) return null;
    const p = await response.json();
    return { id: p.id, url: p.url, photographer: p.photographer, src: p.src, alt: p.alt };
  }
}
