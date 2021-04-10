-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('USER', 'OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "propertyCategory" AS ENUM ('HOUSE', 'APARTMENT');

-- CreateEnum
CREATE TYPE "userSex" AS ENUM ('NOTKNOW', 'MALE', 'FEMALE', 'NOTAPPLICABLE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "role" "userRole" NOT NULL DEFAULT E'USER',
    "sex" "userSex" NOT NULL DEFAULT E'NOTKNOW',
    "tel" TEXT NOT NULL,
    "cel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" SERIAL NOT NULL,
    "uConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "pConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "img" TEXT[],
    "category" "propertyCategory" NOT NULL DEFAULT E'HOUSE',
    "vacancyPrice" DOUBLE PRECISION NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "neighborhood" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "number" VARCHAR(5),
    "complement" VARCHAR(100),
    "hasPool" BOOLEAN NOT NULL DEFAULT false,
    "hasGarage" BOOLEAN NOT NULL DEFAULT false,
    "hasGourmet" BOOLEAN NOT NULL DEFAULT false,
    "hasInternet" BOOLEAN NOT NULL DEFAULT false,
    "isPetFriendly" BOOLEAN NOT NULL DEFAULT false,
    "vacancyNumber" INTEGER NOT NULL DEFAULT 1,
    "isAdversiment" BOOLEAN NOT NULL DEFAULT false,
    "viewed" INTEGER NOT NULL DEFAULT 0,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "guestId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_favoriteProperties" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rent.guestId_unique" ON "Rent"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "_favoriteProperties_AB_unique" ON "_favoriteProperties"("A", "B");

-- CreateIndex
CREATE INDEX "_favoriteProperties_B_index" ON "_favoriteProperties"("B");

-- AddForeignKey
ALTER TABLE "Interest" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favoriteProperties" ADD FOREIGN KEY ("A") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favoriteProperties" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;