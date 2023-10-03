export interface ResponsePayload<T> {
  statusCode?: number;
  message?: string;
  channel?: string;
  data?: T;
  meta?: any;
}
