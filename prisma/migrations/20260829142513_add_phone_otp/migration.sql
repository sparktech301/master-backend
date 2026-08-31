-- DropIndex
DROP INDEX "PhoneOtp_phoneNumber_code_idx";

-- AlterTable
ALTER TABLE "PhoneOtp" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "PhoneOtp_phoneNumber_isUsed_expiresAt_idx" ON "PhoneOtp"("phoneNumber", "isUsed", "expiresAt");

-- CreateIndex
CREATE INDEX "PhoneOtp_phoneNumber_createdAt_idx" ON "PhoneOtp"("phoneNumber", "createdAt");
