import { HttpError } from "./http-error.js";

export function parseNrp(value: unknown): string {
  if (typeof value !== "string" || !value) {
    throw new HttpError(400, "NRP wajib diisi");
  }

  return value;
}
