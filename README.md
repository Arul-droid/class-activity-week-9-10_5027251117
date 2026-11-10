# Class Activity Week 9-10 - Manajemen Data Mahasiswa

Aplikasi web sederhana untuk mengelola data mahasiswa menggunakan Express, TypeScript, Prisma, dan PostgreSQL. Aplikasi menyediakan antarmuka web dan REST API untuk melihat, menambah, mengubah, dan menghapus data mahasiswa.

## Tampilan aplikasi

![Tampilan web manajemen mahasiswa](assets/tampilan%20web_117.png)

## Contoh penggunaan API

### Menambahkan mahasiswa

![Contoh request POST mahasiswa](assets/POST_117.png)

### Mengubah data mahasiswa

![Contoh request PUT mahasiswa](assets/PUT_117.png)

### Menghapus mahasiswa

![Contoh request DELETE mahasiswa](assets/DELETE_117.png)

## Teknologi

- Node.js dan npm
- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL

## Cara menjalankan

### Prasyarat

- Node.js dan npm sudah terpasang.
- PostgreSQL sudah berjalan dan database untuk aplikasi sudah dibuat.

### Instalasi dan konfigurasi

1. Clone repository dan masuk ke folder proyek:

   ```bash
   git clone https://github.com/Arul-droid/class-activity-week-9-10_5027251117.git
   cd class-activity-week-9-10_5027251117
   ```

2. Pasang dependency:

   ```bash
   npm install
   ```

3. Buat file `.env` di root proyek, lalu isi URL koneksi PostgreSQL. Sesuaikan nama pengguna, kata sandi, host, port, dan nama database dengan konfigurasi lokal:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ```

   Jangan unggah file `.env` atau membagikan kredensial database.

4. Buat Prisma Client dan terapkan migrasi database:

   ```bash
   npm run prisma:generate
   npm run db:migrate
   ```

5. (Opsional) Isi database dengan data contoh:

   ```bash
   npm run db:seed
   ```

### Menjalankan aplikasi

Jalankan server mode pengembangan dengan hot reload:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser. Untuk menggunakan port lain, tambahkan `PORT=3001` (atau port yang diinginkan) ke `.env`.

Untuk menjalankan server tanpa watch mode:

```bash
npm start
```

## Endpoint API

Semua endpoint menggunakan prefix `/mahasiswa`.

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `GET` | `/mahasiswa` | Mengambil semua data mahasiswa |
| `GET` | `/mahasiswa/:nrp` | Mengambil data berdasarkan NRP |
| `POST` | `/mahasiswa` | Menambahkan mahasiswa |
| `PATCH` | `/mahasiswa/:nrp` | Memperbarui data mahasiswa |
| `PUT` | `/mahasiswa/:nrp` | Memperbarui data mahasiswa |
| `DELETE` | `/mahasiswa/:nrp` | Menghapus data mahasiswa |
| `GET` | `/health` | Memeriksa koneksi server dan database |
