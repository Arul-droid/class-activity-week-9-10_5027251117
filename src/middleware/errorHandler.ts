import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error.js";

function getErrorProperty(error: unknown, key: string): unknown {
  if (typeof error === "object" && error !== null && key in error) {
    return error[key as keyof typeof error];
  }
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      status: false,
      message: error.message,
    });
    return;
  }

  const code = getErrorProperty(error, "code");
  if (code === "P2002") {
    res.status(409).json({
      status: false,
      message: "NRP sudah terdaftar",
    });
    return;
  }

  if (code === "P2025") {
    res.status(404).json({
      status: false,
      message: "Mahasiswa tidak ditemukan",
    });
    return;
  }

  if (code === "P2003") {
    res.status(400).json({
      status: false,
      message: "Relasi data tidak valid",
    });
    return;
  }

  if (getErrorProperty(error, "status") === 400) {
    res.status(400).json({
      status: false,
      message: "Request body JSON tidak valid",
    });
    return;
  }

  console.error("Unhandled Error:", error);
  res.status(500).json({
    status: false,
    message: "Terjadi kesalahan pada server",
  });
}
