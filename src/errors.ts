export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function badRequest(message: string, details?: unknown) {
  return new HttpError(400, message, details);
}

export function unauthorized(message = "Authentication required") {
  return new HttpError(401, message);
}

export function forbidden(message = "Forbidden") {
  return new HttpError(403, message);
}

export function notFound(message = "Not found") {
  return new HttpError(404, message);
}

export function notImplemented(message: string) {
  return new HttpError(501, message);
}
