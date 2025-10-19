-- Migration: Sinkronisasi kolom events dengan Drizzle schema
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "slug" text;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "location_name" text;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "location_url" text;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "qr_token" text;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "image" text;
-- Optional: Hapus kolom yang tidak ada di Drizzle schema jika tidak dipakai
-- ALTER TABLE "events" DROP COLUMN IF EXISTS "location";
-- ALTER TABLE "events" DROP COLUMN IF EXISTS "end_time";
