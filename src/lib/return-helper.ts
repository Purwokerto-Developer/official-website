export interface QueryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
export function success<T>(data: T): QueryResult<T> {
  return { success: true, data };
}

export function fail(message: string): QueryResult<never> {
  return { success: false, error: message };
}
