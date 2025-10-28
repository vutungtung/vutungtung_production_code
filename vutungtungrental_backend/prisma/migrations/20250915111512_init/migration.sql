-- CreateEnum
CREATE TYPE "public"."vechileType" AS ENUM ('Automatic', 'Manual');

-- CreateEnum
CREATE TYPE "public"."VehicleStatus" AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "public"."VehicleFuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."VehicleTransmission" AS ENUM ('MANUAL', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "public"."Payment" AS ENUM ('pending', 'hold', 'completed');

-- CreateEnum
CREATE TYPE "public"."DeliveryStatus" AS ENUM ('pending', 'dilivered', 'cancled');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('eSewa', 'khalti', 'fonePay', 'cashOnDelivery');

-- CreateTable
CREATE TABLE "public"."user" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "otpVerify" TEXT DEFAULT '',
    "otpExpired" TIMESTAMP(3),
    "updateOtp" TEXT,
    "updateOtpExpire" TIMESTAMP(3),
    "resetOtp" TEXT DEFAULT '',
    "resetOtpExpired" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Vehicle" (
    "v_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "description" TEXT,
    "licensePlate" TEXT NOT NULL,
    "vin" TEXT,
    "mileage" INTEGER,
    "fuelType" "public"."VehicleFuelType" NOT NULL DEFAULT 'PETROL',
    "transmission" "public"."VehicleTransmission" NOT NULL DEFAULT 'MANUAL',
    "seatingCapacity" INTEGER NOT NULL,
    "dailyRate" DECIMAL(10,2) NOT NULL,
    "status" "public"."VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "image" TEXT,
    "image1" TEXT,
    "image2" TEXT,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("v_id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "c_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("c_id")
);

-- CreateTable
CREATE TABLE "public"."admin" (
    "adminId" SERIAL NOT NULL,
    "ownername" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passowrd" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "otpVerify" TEXT DEFAULT '',
    "otpExpired" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'admin',

    CONSTRAINT "admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "public"."login" (
    "loginId" SERIAL NOT NULL,
    "userId" INTEGER,
    "adminId" INTEGER,
    "refreshToken" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "login_pkey" PRIMARY KEY ("loginId")
);

-- CreateTable
CREATE TABLE "public"."booking" (
    "bookingId" SERIAL NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "useremail" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "vehicleName" TEXT,
    "categoryName" TEXT,
    "categoryId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "pickuplocation" TEXT NOT NULL,
    "droplocation" TEXT NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "licenseImg" TEXT,
    "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'cashOnDelivery',
    "paymentStatus" "public"."Payment" NOT NULL DEFAULT 'pending',
    "deliverystatus" "public"."DeliveryStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("bookingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "public"."Vehicle"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vin_key" ON "public"."Vehicle"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "admin_ownername_key" ON "public"."admin"("ownername");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "public"."admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "login_refreshToken_key" ON "public"."login"("refreshToken");

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."login" ADD CONSTRAINT "login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."login" ADD CONSTRAINT "login_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_useremail_fkey" FOREIGN KEY ("useremail") REFERENCES "public"."user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("v_id") ON DELETE RESTRICT ON UPDATE CASCADE;
