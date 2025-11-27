export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;
  public code?: string;

  constructor(statusCode: number, message: string, details?: unknown, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

