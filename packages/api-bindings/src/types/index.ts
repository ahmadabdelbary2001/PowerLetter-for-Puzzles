// Shared API types for requests and responses
export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: Record<string, any>;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
}
