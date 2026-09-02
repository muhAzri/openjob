# OpenJob Consumer

Service independen yang mengonsumsi event `application_created` dari RabbitMQ (dipublish oleh [`openjob_api`](../openjob_api/) setiap ada lamaran baru), lalu membaca data lamaran/lowongan/user dari PostgreSQL dan mengirim email notifikasi ke pemilik lowongan.

Project ini punya `package.json` dan dependency sendiri, terpisah dari `openjob_api`, dan hanya terhubung lewat RabbitMQ serta database PostgreSQL yang sama.

## Prasyarat

- Node.js v20 atau lebih baru
- PostgreSQL yang sama dengan yang dipakai `openjob_api` (harus sudah ada & sudah dimigrasikan)
- RabbitMQ sudah berjalan — jalankan lewat `docker compose up -d` di folder [`openjob_api`](../openjob_api/), karena consumer ini terhubung ke instance RabbitMQ yang sama dengan API

## 1. Install

```bash
cd openjob_consumer
npm install
```

## 2. Konfigurasi Environment

```bash
cp .env.example .env
```

Sesuaikan minimal:

- `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGHOST`, `PGPORT` — harus mengarah ke database yang sama dengan `openjob_api`.
- `RABBITMQ_HOST`/`RABBITMQ_PORT`/`RABBITMQ_USER`/`RABBITMQ_PASSWORD` — harus cocok dengan instance RabbitMQ yang dipakai `openjob_api`.
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASSWORD` — kredensial SMTP untuk mengirim email notifikasi (bisa pakai [Ethereal](https://ethereal.email/) untuk testing).

## 3. Jalankan Consumer

Pastikan `openjob_api` (beserta Redis & RabbitMQ dari docker compose-nya) sudah berjalan terlebih dahulu, lalu:

Development (auto-reload):

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm start
```

Consumer akan menunggu pesan pada queue `applications_queue` dan mengirim email setiap kali ada lamaran baru masuk lewat `openjob_api`.

## Ringkasan Perintah

| Perintah                       | Keterangan                             |
| ------------------------------ | -------------------------------------- |
| `npm run start:dev`            | Jalankan consumer (dev)                |
| `npm run build` && `npm start` | Build & jalankan consumer (production) |
| `npm run lint`                 | Cek linting                            |
| `npm run format`               | Format kode                            |
