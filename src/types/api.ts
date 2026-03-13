export type ApiSuccessResponse<T = any> = {
  data: T;
  message: string;
};

export type ApiErrorResponse = {
  error: string | any;
  message: string;
};

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
