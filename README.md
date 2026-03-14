# Sisi Kopi POS UI

Siap pakai untuk Next.js App Router + Tailwind CSS.

## Langkah pakai

1. Salin folder `src` ke project Next.js kamu.
2. Ganti `next.config.ts` dengan file yang ada di paket ini, atau merge bagian `images.remotePatterns`.
3. Install dependency:

```bash
npm install lucide-react
```

4. Pastikan alias `@/*` aktif di `tsconfig.json`.
5. Buka route:

```bash
/dashboard/pos
```

## Catatan

- Data masih dummy dan mudah diganti ke Supabase.
- Layout sudah responsive: mobile terpisah, desktop/tablet satu pola.
- Struktur sudah modular agar mudah dikembangkan.
