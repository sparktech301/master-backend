-- CreateTable
CREATE TABLE "ServiceAssignee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceAssignee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceAssignee_userId_idx" ON "ServiceAssignee"("userId");

-- CreateIndex
CREATE INDEX "ServiceAssignee_serviceId_idx" ON "ServiceAssignee"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceAssignee_userId_serviceId_key" ON "ServiceAssignee"("userId", "serviceId");

-- AddForeignKey
ALTER TABLE "ServiceAssignee" ADD CONSTRAINT "ServiceAssignee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAssignee" ADD CONSTRAINT "ServiceAssignee_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
