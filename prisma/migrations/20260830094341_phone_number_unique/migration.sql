/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `PhoneOtp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PhoneOtp_phoneNumber_key" ON "PhoneOtp"("phoneNumber");
