import type { Response } from "express";

export function sendSuccess(
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown,
): void {
  const response: Record<string, unknown> = {
    status: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
}
