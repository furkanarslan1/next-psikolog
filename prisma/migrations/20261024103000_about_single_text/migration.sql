-- Özet kaldırılıyor: tam metin boşsa mevcut özet metne taşınır
UPDATE "About"
SET "content" = '<p>' || replace(replace(replace("summary", '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</p>'
WHERE "content" IS NULL OR btrim("content") = '';

-- AlterTable
ALTER TABLE "About" DROP COLUMN "summary";
ALTER TABLE "About" ALTER COLUMN "content" SET NOT NULL;
