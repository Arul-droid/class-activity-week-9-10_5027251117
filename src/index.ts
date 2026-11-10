import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT harus berupa angka antara 1 dan 65535");
}

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
