export interface Response {
  status: boolean;
  data?: any;
  error?: {
    message?: string;
    statusCode?: number;
    errorType?: string;
  };
}
