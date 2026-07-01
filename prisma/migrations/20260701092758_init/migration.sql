-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT,
    "salary" TEXT,
    "jobUrl" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'WISHLIST',
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "JobApplication_userId_idx" ON "JobApplication"("userId");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");
