-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('NOT_REALIZED', 'REALIZED', 'REALIZED_DISABLED');

-- CreateEnum
CREATE TYPE "MainAssetStatus" AS ENUM ('UNDEFINED', 'OWNED', 'PINNED', 'TRANSFERED');

-- CreateEnum
CREATE TYPE "StockpileStatus" AS ENUM ('UNDEFINED', 'OWNED', 'TRANSFERED');

-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('ADD_SUPPLY', 'PIN_MAIN_ASSET', 'TRANSFER_SUPPLY');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainAsset" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" "MainAssetStatus" NOT NULL DEFAULT 'OWNED',
    "groupId" INTEGER,
    "dateOfManufacture" DATE NOT NULL,
    "dateOfStartOperation" DATE NOT NULL,
    "inventoryNumber" VARCHAR(50) NOT NULL,
    "serialNumber" VARCHAR(50) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "integerId" INTEGER NOT NULL,
    "cost" MONEY NOT NULL,
    "aowat" MONEY NOT NULL,
    "addDocId" INTEGER NOT NULL,

    CONSTRAINT "MainAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stockpile" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" "StockpileStatus" NOT NULL DEFAULT 'OWNED',
    "groupId" INTEGER,
    "dateOfManufacture" DATE NOT NULL,
    "inventoryNumber" VARCHAR(50) NOT NULL,
    "serialNumber" VARCHAR(50) NOT NULL,
    "balanceAmount" INTEGER NOT NULL,
    "actualAmount" INTEGER NOT NULL,
    "integerId" INTEGER NOT NULL,
    "cost" MONEY NOT NULL,
    "addDocId" INTEGER NOT NULL,

    CONSTRAINT "Stockpile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferredStockpile" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "TransferredStockpile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(30) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyCategory" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(20) NOT NULL,

    CONSTRAINT "SupplyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integer" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(10) NOT NULL,

    CONSTRAINT "Integer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAddSupply" (
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

    CONSTRAINT "DocumentAddSupply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentPinMainAsset" (
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
    "holderId" INTEGER NOT NULL,

    CONSTRAINT "DocumentPinMainAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentTransferSupply" (
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
    "holderId" INTEGER NOT NULL,

    CONSTRAINT "DocumentTransferSupply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllowedDocTypeToOperation" (
    "id" SERIAL NOT NULL,
    "operation" "Operation" NOT NULL,
    "docTypeId" INTEGER NOT NULL,

    CONSTRAINT "AllowedDocTypeToOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotSystemUnit" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "NotSystemUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "extraInfo" TEXT NOT NULL,
    "holderNotSystemUnitId" INTEGER,

    CONSTRAINT "Holder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferSupplyHolder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "holderNotSystemUnitId" INTEGER,

    CONSTRAINT "TransferSupplyHolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentPinMainAssetToMainAsset" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentTransferSupplyToMainAsset" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentTransferSupplyToTransferredStockpile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_title_key" ON "Group"("title");

-- CreateIndex
CREATE UNIQUE INDEX "SupplyCategory_title_key" ON "SupplyCategory"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Integer_title_key" ON "Integer"("title");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentAddSupply_typeId_number_date_key" ON "DocumentAddSupply"("typeId", "number", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentPinMainAsset_typeId_number_date_key" ON "DocumentPinMainAsset"("typeId", "number", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentTransferSupply_typeId_number_date_key" ON "DocumentTransferSupply"("typeId", "number", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_title_key" ON "DocumentType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "NotSystemUnit_title_key" ON "NotSystemUnit"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Holder_name_key" ON "Holder"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TransferSupplyHolder_name_key" ON "TransferSupplyHolder"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentPinMainAssetToMainAsset_AB_unique" ON "_DocumentPinMainAssetToMainAsset"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentPinMainAssetToMainAsset_B_index" ON "_DocumentPinMainAssetToMainAsset"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentTransferSupplyToMainAsset_AB_unique" ON "_DocumentTransferSupplyToMainAsset"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentTransferSupplyToMainAsset_B_index" ON "_DocumentTransferSupplyToMainAsset"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentTransferSupplyToTransferredStockpile_AB_unique" ON "_DocumentTransferSupplyToTransferredStockpile"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentTransferSupplyToTransferredStockpile_B_index" ON "_DocumentTransferSupplyToTransferredStockpile"("B");

-- AddForeignKey
ALTER TABLE "MainAsset" ADD CONSTRAINT "MainAsset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SupplyCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainAsset" ADD CONSTRAINT "MainAsset_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainAsset" ADD CONSTRAINT "MainAsset_integerId_fkey" FOREIGN KEY ("integerId") REFERENCES "Integer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainAsset" ADD CONSTRAINT "MainAsset_addDocId_fkey" FOREIGN KEY ("addDocId") REFERENCES "DocumentAddSupply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stockpile" ADD CONSTRAINT "Stockpile_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stockpile" ADD CONSTRAINT "Stockpile_integerId_fkey" FOREIGN KEY ("integerId") REFERENCES "Integer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stockpile" ADD CONSTRAINT "Stockpile_addDocId_fkey" FOREIGN KEY ("addDocId") REFERENCES "DocumentAddSupply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferredStockpile" ADD CONSTRAINT "TransferredStockpile_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Stockpile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAddSupply" ADD CONSTRAINT "DocumentAddSupply_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AllowedDocTypeToOperation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAddSupply" ADD CONSTRAINT "DocumentAddSupply_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAddSupply" ADD CONSTRAINT "DocumentAddSupply_realizatorId_fkey" FOREIGN KEY ("realizatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPinMainAsset" ADD CONSTRAINT "DocumentPinMainAsset_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AllowedDocTypeToOperation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPinMainAsset" ADD CONSTRAINT "DocumentPinMainAsset_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPinMainAsset" ADD CONSTRAINT "DocumentPinMainAsset_realizatorId_fkey" FOREIGN KEY ("realizatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPinMainAsset" ADD CONSTRAINT "DocumentPinMainAsset_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Holder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTransferSupply" ADD CONSTRAINT "DocumentTransferSupply_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AllowedDocTypeToOperation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTransferSupply" ADD CONSTRAINT "DocumentTransferSupply_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTransferSupply" ADD CONSTRAINT "DocumentTransferSupply_realizatorId_fkey" FOREIGN KEY ("realizatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTransferSupply" ADD CONSTRAINT "DocumentTransferSupply_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "TransferSupplyHolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowedDocTypeToOperation" ADD CONSTRAINT "AllowedDocTypeToOperation_docTypeId_fkey" FOREIGN KEY ("docTypeId") REFERENCES "DocumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holder" ADD CONSTRAINT "Holder_holderNotSystemUnitId_fkey" FOREIGN KEY ("holderNotSystemUnitId") REFERENCES "NotSystemUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferSupplyHolder" ADD CONSTRAINT "TransferSupplyHolder_holderNotSystemUnitId_fkey" FOREIGN KEY ("holderNotSystemUnitId") REFERENCES "NotSystemUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentPinMainAssetToMainAsset" ADD CONSTRAINT "_DocumentPinMainAssetToMainAsset_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentPinMainAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentPinMainAssetToMainAsset" ADD CONSTRAINT "_DocumentPinMainAssetToMainAsset_B_fkey" FOREIGN KEY ("B") REFERENCES "MainAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTransferSupplyToMainAsset" ADD CONSTRAINT "_DocumentTransferSupplyToMainAsset_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentTransferSupply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTransferSupplyToMainAsset" ADD CONSTRAINT "_DocumentTransferSupplyToMainAsset_B_fkey" FOREIGN KEY ("B") REFERENCES "MainAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTransferSupplyToTransferredStockpile" ADD CONSTRAINT "_DocumentTransferSupplyToTransferredStockpile_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentTransferSupply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTransferSupplyToTransferredStockpile" ADD CONSTRAINT "_DocumentTransferSupplyToTransferredStockpile_B_fkey" FOREIGN KEY ("B") REFERENCES "TransferredStockpile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
