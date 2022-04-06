export interface IPagination {
  total: number;
  page: number;
  page_size: number;
}

export interface IFilter {
  page: number;
  page_size: number;
  sort_by: string;
  sort_order: 'ASC' | 'DESC';
}

export interface IResponse<T> {
  data: T;
  pagination: IPagination;
}
