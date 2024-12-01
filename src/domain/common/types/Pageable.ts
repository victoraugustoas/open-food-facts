export interface PageableRequest {
  page: number;
  limit: number;
}

export interface PageableResponse<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}
