-- CreateTable
CREATE TABLE "DocumentChangeCategory" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "date" DATE NOT NULL,
    "status" "DocumentStatus" NOT NULL,
    "typeId" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL,
    "realizedAt" DATE,
    "scans" TEXT[],
    "creatorId" UUID NOT NULL,
    "realizatorId" UUID,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "DocumentChangeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentChangeCategoryToMainAsset" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentChangeCategory_typeId_number_date_key" ON "DocumentChangeCategory"("typeId", "number", "date");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentChangeCategoryToMainAsset_AB_unique" ON "_DocumentChangeCategoryToMainAsset"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentChangeCategoryToMainAsset_B_index" ON "_DocumentChangeCategoryToMainAsset"("B");

-- AddForeignKey
ALTER TABLE "DocumentChangeCategory" ADD CONSTRAINT "DocumentChangeCategory_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AllowedDocTypeToOperation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChangeCategory" ADD CONSTRAINT "DocumentChangeCategory_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChangeCategory" ADD CONSTRAINT "DocumentChangeCategory_realizatorId_fkey" FOREIGN KEY ("realizatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChangeCategory" ADD CONSTRAINT "DocumentChangeCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SupplyCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentChangeCategoryToMainAsset" ADD CONSTRAINT "_DocumentChangeCategoryToMainAsset_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentChangeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentChangeCategoryToMainAsset" ADD CONSTRAINT "_DocumentChangeCategoryToMainAsset_B_fkey" FOREIGN KEY ("B") REFERENCES "MainAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
