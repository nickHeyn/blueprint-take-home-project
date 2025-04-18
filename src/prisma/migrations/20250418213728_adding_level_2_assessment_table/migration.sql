-- CreateTable
CREATE TABLE "Level2Assessment" (
    "id" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,
    "threhold_inclusive" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Level2Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Level2Assessment_domain_id_key" ON "Level2Assessment"("domain_id");

-- AddForeignKey
ALTER TABLE "Level2Assessment" ADD CONSTRAINT "Level2Assessment_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
