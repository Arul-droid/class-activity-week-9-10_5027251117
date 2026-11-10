import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { HttpError } from "../utils/http-error.js";
import { parseNrp } from "../utils/parse.js";
import { sendSuccess } from "../utils/response.js";

export async function getMahasiswa(_req: Request, res: Response): Promise<void> {
  const mahasiswa = await prisma.mahasiswa.findMany({
    orderBy: { nrp: "asc" },
  });

  sendSuccess(res, 200, "Daftar mahasiswa berhasil diambil", mahasiswa);
}

export async function getMahasiswaByNrp(
  req: Request,
  res: Response,
): Promise<void> {
  const nrp = parseNrp(req.params.nrp);

  const mahasiswa = await prisma.mahasiswa.findUnique({ where: { nrp } });

  if (!mahasiswa) {
    throw new HttpError(404, "Mahasiswa tidak ditemukan");
  }

  sendSuccess(res, 200, "Berhasil mengambil data mahasiswa", mahasiswa);
}

export async function createMahasiswa(
  req: Request,
  res: Response,
): Promise<void> {
  const { nama, nrp } = req.body ?? {};

  if (
    typeof nama !== "string" ||
    !nama.trim() ||
    typeof nrp !== "string" ||
    !nrp.trim()
  ) {
    throw new HttpError(400, "nama dan nrp wajib diisi sebagai teks");
  }

  const existingMahasiswa = await prisma.mahasiswa.findUnique({
    where: { nrp: nrp.trim() },
    select: { id: true },
  });

  if (existingMahasiswa) {
    throw new HttpError(409, "NRP sudah terdaftar. Gunakan NRP lain.");
  }

  const mahasiswa = await prisma.mahasiswa.create({
    data: { nama: nama.trim(), nrp: nrp.trim() },
  });

  sendSuccess(res, 201, "Data mahasiswa berhasil ditambahkan", mahasiswa);
}

export async function updateMahasiswa(
  req: Request,
  res: Response,
): Promise<void> {
  const nrp = parseNrp(req.params.nrp);
  const { nama, nrpBaru } = req.body ?? {};

  if (nama === undefined && nrpBaru === undefined) {
    throw new HttpError(400, "Isi nama atau nrpBaru untuk memperbarui data");
  }

  if (
    (nama !== undefined && (typeof nama !== "string" || !nama.trim())) ||
    (nrpBaru !== undefined &&
      (typeof nrpBaru !== "string" || !nrpBaru.trim()))
  ) {
    throw new HttpError(
      400,
      "nama dan nrpBaru harus berupa teks yang tidak kosong",
    );
  }

  if (nrpBaru !== undefined) {
    const existingMahasiswa = await prisma.mahasiswa.findUnique({
      where: { nrp: nrpBaru.trim() },
      select: { nrp: true },
    });

    if (existingMahasiswa && existingMahasiswa.nrp !== nrp) {
      throw new HttpError(409, "NRP sudah terdaftar. Gunakan NRP lain.");
    }
  }

  const mahasiswa = await prisma.mahasiswa.update({
    where: { nrp },
    data: {
      ...(nama !== undefined ? { nama: nama.trim() } : {}),
      ...(nrpBaru !== undefined ? { nrp: nrpBaru.trim() } : {}),
    },
  });

  sendSuccess(res, 200, "Data mahasiswa berhasil diperbarui", mahasiswa);
}

export async function deleteMahasiswa(
  req: Request,
  res: Response,
): Promise<void> {
  const nrp = parseNrp(req.params.nrp);

  await prisma.mahasiswa.delete({ where: { nrp } });
  sendSuccess(res, 200, "Data mahasiswa berhasil dihapus");
}
