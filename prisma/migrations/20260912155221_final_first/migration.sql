/*
  Warnings:

  - The values [MAIL,FEMAIL] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `conversationId` on the `ChatParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `Message` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `ProviderProfile` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(3,2)`.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Service` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `avaterUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isPhoneVerification` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessionId,userId]` on the table `ChatParticipant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobileNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `ChatParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatTabCategory" AS ENUM ('SERVICE', 'ORDER', 'SUPPORT');

-- CreateEnum
CREATE TYPE "ChatFlowType" AS ENUM ('CUSTOMER_PROVIDER', 'CUSTOMER_COUNSELOR', 'CUSTOMER_SUPPORT');

-- CreateEnum
CREATE TYPE "ChatSlotStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'BKASH', 'NAGAD', 'CARD', 'BANK');

-- CreateEnum
CREATE TYPE "ConfirmationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DISPUTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ProviderLevel" AS ENUM ('NEW', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RevisionStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AuditFlowType" AS ENUM ('CHAT', 'ORDER', 'PAYMENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "CounselorActionType" AS ENUM ('ASSIGNED', 'REASSIGNED', 'CLOSED', 'NOTE_ADDED');

-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MALE', 'FEMALE', 'OTHER');
ALTER TABLE "CustomerProfile" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
COMMIT;

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'TECHNICIAN';

-- DropForeignKey
ALTER TABLE "ChatParticipant" DROP CONSTRAINT "ChatParticipant_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_categoryId_fkey";

-- DropIndex
DROP INDEX "ChatParticipant_conversationId_idx";

-- DropIndex
DROP INDEX "ChatParticipant_conversationId_userId_key";

-- DropIndex
DROP INDEX "Message_conversationId_idx";

-- DropIndex
DROP INDEX "User_phoneNumber_fullName_idx";

-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- AlterTable
ALTER TABLE "ChatParticipant" DROP COLUMN "conversationId",
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CounselorProfile" ADD COLUMN     "avgResponseTimeSec" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxConcurrentLimit" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CustomerProfile" ALTER COLUMN "dateOfBirth" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "conversationId",
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "isBlockedForNegative" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "level" "ProviderLevel" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "monthlyEarnings" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
ADD COLUMN     "totalCompletedOrders" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "walletBalance" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(3,2);

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "price",
DROP COLUMN "title",
ADD COLUMN     "basePrice" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
ADD COLUMN     "isFixedPrice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avaterUrl",
DROP COLUMN "fullName",
DROP COLUMN "isPhoneVerification",
DROP COLUMN "phoneNumber",
ADD COLUMN     "dateOfBirth" DATE,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mobileNumber" VARCHAR(15) NOT NULL,
ADD COLUMN     "name" VARCHAR(100),
ADD COLUMN     "otp" VARCHAR(8),
ADD COLUMN     "otpExpire" TIMESTAMP(3),
ADD COLUMN     "profilePhoto" VARCHAR(255);

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Conversation";

-- CreateTable
CREATE TABLE "UserAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressText" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicianProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAgencyId" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "invitedAt" TIMESTAMP(3),
    "currentLat" DECIMAL(10,8),
    "currentLong" DECIMAL(11,8),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechnicianProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderKyc" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "nidNumber" VARCHAR(30),
    "tradeLicenseNo" VARCHAR(40),
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "nidFrontUrl" VARCHAR(255),
    "nidBackUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderKyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" VARCHAR(255),
    "isFixedPrice" BOOLEAN NOT NULL DEFAULT false,
    "basePrice" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "counselorId" TEXT,
    "providerId" TEXT,
    "customerProfileId" TEXT,
    "serviceId" TEXT,
    "tabCategory" "ChatTabCategory" NOT NULL DEFAULT 'SERVICE',
    "flowType" "ChatFlowType" NOT NULL DEFAULT 'CUSTOMER_PROVIDER',
    "assignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatAuditLog" (
    "id" BIGSERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "senderId" TEXT,
    "flowType" "AuditFlowType" NOT NULL,
    "messageType" "MessageType",
    "messagePayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveChatSlot" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" "ChatSlotStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveChatSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerRetention" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "isChatActive" BOOLEAN NOT NULL DEFAULT true,
    "removedReason" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerRetention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "technicianId" TEXT,
    "serviceId" TEXT NOT NULL,
    "originalPrice" DECIMAL(10,2) NOT NULL,
    "adminCommission" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "additionalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "priceEditCount" INTEGER NOT NULL DEFAULT 0,
    "advancePaid" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "dueAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderPaymentAndTip" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentMode" "PaymentMode" NOT NULL,
    "serviceAmountPaid" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "tipAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "hasTip" BOOLEAN NOT NULL DEFAULT false,
    "confirmationStatus" "ConfirmationStatus" NOT NULL DEFAULT 'PENDING',
    "confirmationDeadline" TIMESTAMP(3),
    "customerConfirmedAt" TIMESTAMP(3),
    "disputeReason" TEXT,
    "varianceFlag" BOOLEAN NOT NULL DEFAULT false,
    "isGuestOrder" BOOLEAN NOT NULL DEFAULT false,
    "completedByPartner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderPaymentAndTip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRevision" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "attachedImages" TEXT[],
    "revisionStatus" "RevisionStatus" NOT NULL DEFAULT 'REQUESTED',
    "warrantyExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderReview" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerRating" INTEGER NOT NULL,
    "providerRating" INTEGER,
    "reviewComment" TEXT,
    "continueWithProvider" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselorAuditLog" (
    "id" TEXT NOT NULL,
    "counselorId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "actionType" "CounselorActionType" NOT NULL,
    "remarks" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounselorAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAddress_userId_idx" ON "UserAddress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicianProfile_userId_key" ON "TechnicianProfile"("userId");

-- CreateIndex
CREATE INDEX "TechnicianProfile_providerAgencyId_idx" ON "TechnicianProfile"("providerAgencyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderKyc_providerId_key" ON "ProviderKyc"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_name_key" ON "ServiceCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE INDEX "ChatSession_customerId_idx" ON "ChatSession"("customerId");

-- CreateIndex
CREATE INDEX "ChatSession_counselorId_idx" ON "ChatSession"("counselorId");

-- CreateIndex
CREATE INDEX "ChatSession_providerId_idx" ON "ChatSession"("providerId");

-- CreateIndex
CREATE INDEX "ChatSession_customerProfileId_idx" ON "ChatSession"("customerProfileId");

-- CreateIndex
CREATE INDEX "ChatSession_serviceId_idx" ON "ChatSession"("serviceId");

-- CreateIndex
CREATE INDEX "ChatAuditLog_sessionId_idx" ON "ChatAuditLog"("sessionId");

-- CreateIndex
CREATE INDEX "ChatAuditLog_senderId_idx" ON "ChatAuditLog"("senderId");

-- CreateIndex
CREATE INDEX "ActiveChatSlot_providerId_idx" ON "ActiveChatSlot"("providerId");

-- CreateIndex
CREATE INDEX "ActiveChatSlot_customerId_idx" ON "ActiveChatSlot"("customerId");

-- CreateIndex
CREATE INDEX "ActiveChatSlot_serviceId_idx" ON "ActiveChatSlot"("serviceId");

-- CreateIndex
CREATE INDEX "CustomerRetention_providerId_idx" ON "CustomerRetention"("providerId");

-- CreateIndex
CREATE INDEX "CustomerRetention_customerId_idx" ON "CustomerRetention"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerRetention_providerId_customerId_key" ON "CustomerRetention"("providerId", "customerId");

-- CreateIndex
CREATE INDEX "Order_providerId_idx" ON "Order"("providerId");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_technicianId_idx" ON "Order"("technicianId");

-- CreateIndex
CREATE INDEX "Order_serviceId_idx" ON "Order"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderPaymentAndTip_orderId_key" ON "OrderPaymentAndTip"("orderId");

-- CreateIndex
CREATE INDEX "ServiceRevision_orderId_idx" ON "ServiceRevision"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderReview_orderId_key" ON "ProviderReview"("orderId");

-- CreateIndex
CREATE INDEX "ProviderReview_providerId_idx" ON "ProviderReview"("providerId");

-- CreateIndex
CREATE INDEX "ProviderReview_customerId_idx" ON "ProviderReview"("customerId");

-- CreateIndex
CREATE INDEX "CounselorAuditLog_counselorId_idx" ON "CounselorAuditLog"("counselorId");

-- CreateIndex
CREATE INDEX "CounselorAuditLog_sessionId_idx" ON "CounselorAuditLog"("sessionId");

-- CreateIndex
CREATE INDEX "ChatParticipant_sessionId_idx" ON "ChatParticipant"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_sessionId_userId_key" ON "ChatParticipant"("sessionId", "userId");

-- CreateIndex
CREATE INDEX "Message_sessionId_idx" ON "Message"("sessionId");

-- CreateIndex
CREATE INDEX "Service_categoryId_idx" ON "Service"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNumber_key" ON "User"("mobileNumber");

-- CreateIndex
CREATE INDEX "User_mobileNumber_name_idx" ON "User"("mobileNumber", "name");

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicianProfile" ADD CONSTRAINT "TechnicianProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicianProfile" ADD CONSTRAINT "TechnicianProfile_providerAgencyId_fkey" FOREIGN KEY ("providerAgencyId") REFERENCES "ProviderProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderKyc" ADD CONSTRAINT "ProviderKyc_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatAuditLog" ADD CONSTRAINT "ChatAuditLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatAuditLog" ADD CONSTRAINT "ChatAuditLog_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveChatSlot" ADD CONSTRAINT "ActiveChatSlot_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveChatSlot" ADD CONSTRAINT "ActiveChatSlot_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveChatSlot" ADD CONSTRAINT "ActiveChatSlot_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRetention" ADD CONSTRAINT "CustomerRetention_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRetention" ADD CONSTRAINT "CustomerRetention_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "TechnicianProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPaymentAndTip" ADD CONSTRAINT "OrderPaymentAndTip_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRevision" ADD CONSTRAINT "ServiceRevision_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderReview" ADD CONSTRAINT "ProviderReview_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderReview" ADD CONSTRAINT "ProviderReview_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderReview" ADD CONSTRAINT "ProviderReview_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorAuditLog" ADD CONSTRAINT "CounselorAuditLog_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "CounselorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorAuditLog" ADD CONSTRAINT "CounselorAuditLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
