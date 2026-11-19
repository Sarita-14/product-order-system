/** Shape of every error response (built by AllExceptionsFilter). Used only for Swagger docs. */
export class ErrorResponseDto {
  /** Always false for errors @example false */
  success: boolean;

  /** HTTP status code @example 404 */
  statusCode: number;

  /** What went wrong @example "Product 5c15faf1-90e9-4e91-951c-6a7501af9181 not found" */
  message: string;

  /** Every validation problem, only on validation errors @example ["price must be a positive number"] */
  errors?: string[];

  /** The requested URL @example "/api/v1/products/5c15faf1-90e9-4e91-951c-6a7501af9181" */
  path: string;

  /** When the error happened @example "2026-11-19T10:00:00.000Z" */
  timestamp: string;
}
