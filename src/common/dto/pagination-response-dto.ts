export class PaginationResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}