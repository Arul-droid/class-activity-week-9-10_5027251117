import { Router } from "express";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  getMahasiswaByNrp,
  updateMahasiswa,
} from "../controllers/mahasiswaController.js";

const router = Router();

router.get("/", getMahasiswa);
router.post("/", createMahasiswa);
router.get("/:nrp", getMahasiswaByNrp);
router.patch("/:nrp", updateMahasiswa);
router.put("/:nrp", updateMahasiswa);
router.delete("/:nrp", deleteMahasiswa);

export default router;
