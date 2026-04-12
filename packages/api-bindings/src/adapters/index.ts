// API Adapters for external services
export interface ApiAdapter {
  name: string;
  fetch<T>(url: string): Promise<T>;
}
