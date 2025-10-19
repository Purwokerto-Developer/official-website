export interface QueryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
export function success<T>(data: T): QueryResult<T> {
  return { success: true, data };
}

export function fail<T = never>(message: string): QueryResult<T> {
  return { success: false, error: message };
}
