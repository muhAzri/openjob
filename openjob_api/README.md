# OpenJob API

REST API untuk platform lowongan kerja: registrasi/login, manajemen perusahaan, lowongan, lamaran (dengan resume PDF), bookmark, dan dokumen pendukung. Dibangun dengan Express + TypeScript, PostgreSQL, dan Redis (caching). Saat lamaran baru dibuat, API mem-publish event ke RabbitMQ yang dikonsumsi oleh project terpisah [`openjob_consumer`](../openjob_consumer/).

## Prasyarat

- Node.js v20 atau lebih baru
- PostgreSQL berjalan secara lokal (native, bukan lewat Docker)
- Docker & Docker Compose (untuk menjalankan Redis dan RabbitMQ)

## 1. Install

```bash
cd openjob_api
npm install
```

## 2. Konfigurasi Environment

```bash
cp .env.example .env
```

Sesuaikan minimal:

- `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGHOST`, `PGPORT`, `DATABASE_URL` — kredensial PostgreSQL lokal.
- `ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY` — isi dengan string acak yang panjang.
- `REDIS_HOST`/`REDIS_PORT` dan `RABBITMQ_HOST`/`RABBITMQ_PORT` sudah cocok dengan default `docker-compose.yml` (`localhost`).

## 3. Jalankan Redis & RabbitMQ (Docker)

```bash
docker compose up -d
```

Ini menyalakan:

- **Redis** di `localhost:6379`
- **RabbitMQ** di `localhost:5672` (AMQP) dan `localhost:15672` (management UI, login `guest`/`guest`)

`openjob_consumer` terhubung ke instance RabbitMQ yang sama ini.

## 4. Siapkan Database PostgreSQL

```bash
createdb openjob   # sesuaikan nama & user jika berbeda
npm run migrate:up
```

## 5. Jalankan API

Development (auto-reload):

```bash
npm run start:dev
```

Server berjalan di `http://localhost:5000` (atau sesuai `HOST`/`PORT` di `.env`).

Production:

```bash
npm run build
npm start
```

## Ringkasan Perintah

| Perintah               | Keterangan                |
| ---------------------- | ------------------------- |
| `docker compose up -d` | Jalankan Redis & RabbitMQ |
| `npm run migrate:up`   | Jalankan migrasi database |
| `npm run start:dev`    | Jalankan API server (dev) |
| `npm run lint`         | Cek linting               |
| `npm run format`       | Format kode               |
