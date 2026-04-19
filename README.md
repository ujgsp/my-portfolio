# Personal Blog Ujang Sopiyan

Personal blog ini dibangun menggunakan [Astro](https://astro.build) dengan kustomisasi tema `basic-blog`. Berfokus pada kecepatan, SEO, dan kemudahan dalam penulisan konten Markdown.

## 🚀 Instalasi & Menjalankan di Lokal

### Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18+) dan **npm**.

### Langkah Instalasi
1. Buka terminal dan masuk ke folder proyek:
   ```bash
   cd /home/ujgsp/pribadi/personal-blog
   ```
2. Instal dependensi:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Pastikan sudah ada file `.env` di direktori proyek dengan variabel ini untuk kelancaran *local development* (bisa pakai nilau *dummy*):
   ```env
   PUBLIC_CLOUDINARY_CLOUD_NAME=dellp9a4z
   PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
   ```
4. Jalankan server lokal:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:4321` di browser Anda.

---

## ☁️ Deployment ke GitHub & GitHub Pages

### 1. Push Code ke GitHub
1. Buat repository baru di GitHub tanpa inisialisasi apa pun (kosong).
2. Tautkan reopsitory lokal Anda dengan repositori baru tersebut:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/NAMAREPO.git
   git branch -M main
   git push -u origin main
   ```

### 2. Hubungkan ke GitHub Pages
Karena kita menggunakan Astro (Static Site Generator), kita perlu GitHub Actions untuk melakukan build, bukan sekadar menggunakan branch biasa.
Ikuti referensi dari [Astro GitHub Pages Guide](https://docs.astro.build/en/guides/deploy/github/#configuring-github-actions).

1. Buka settings repository Anda di GitHub: **Settings** > **Pages**
2. Pada bagian **Source**, pilih **GitHub Actions**.
3. Buat direktori Actions di dalam proyek Anda `.github/workflows/deploy.yml` dan simpan konfigurasi berikut:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v4
      - name: Install, build, and upload your site
        uses: withastro/action@v3
        with:
          node-version: 20
          package-manager: npm

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
4. Lakukan `git add .`, commit, dan push pengaturan workflow ini ke repo. Otomatis halaman akan di-build tiap ada _push/commit_ ke branch `main`.

> Catatan: Konfigurasi GitHub Pages mungkin menuntut update di konfigurasi Astro file `astro.config.mjs` misalnya `site: 'https://username.github.io', base: '/namarepo'`.

---

## 📝 Update Konten
Untuk menambah atau memperbarui isi blog dan portofolio, cukup ubah file Markdown di folder `/src/content/`.

- **Mengepost Artikel Blog Baru**: Tambahkan file markdown di folder `/src/content/blog/NAMAPOST.md`.
- **Menambahkan Project Baru**: Tambahkan file markdown di folder `/src/content/projects/NAMAPROJECT.md`.
- **Mengedit Halaman FAQ**: Langsung modifikasi list variabel FAQ pada kode page `/src/pages/faq.astro`.
- **Mengedit Halaman Service**: Buka menu ini melalui `/src/pages/services.astro` dan modifikasi array objek `services`.

Semua *frontmatter* Markdown pada post/portfolio, butuh metadata *wajib* seperti `title`, `description`, `pubDate`, dan lain-lain (detail schema dapat dilihat di file `src/content.config.ts`).

---

## 🎨 Styling CSS & Custom Themes
Astro framework di dalam tema basic-blog ini sudah mendukung **Tailwind CSS v4** sehingga *styling custom* dapat dilakukan dengan cepat.

- **Lokasi Utama CSS Global**: `/src/styles/global.css`
  Gunakan file ini untuk menambahkan utility-class kompleks kustom atau styling spesifik untuk framework tag.
- Tema ini mendukung layout **Dark / Light mode** terpusat dengan mengandalkan konfigurasi dari tailwind.
- Gaya antarmuka halaman seperti `FAQ` dan `Services` dapat diubah secara langsung (inline Tailwind css classes) melalui file di `/src/pages/*.astro`.
