# Class Activity Week 9-10 - Manajemen Data Mahasiswa


## Tampilan aplikasi

![Tampilan web manajemen mahasiswa](assets/tampilan%20web_117.png)

## Contoh penggunaan API

### Menambahkan mahasiswa

![Contoh request POST mahasiswa](assets/POST_117.png)

### Mengubah data mahasiswa

![Contoh request PUT mahasiswa](assets/PUT_117.png)

### Menghapus mahasiswa

![Contoh request DELETE mahasiswa](assets/DELETE_117.png)


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
