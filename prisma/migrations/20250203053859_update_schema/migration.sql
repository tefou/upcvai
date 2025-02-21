/*
  Warnings:

  - Made the column `expiresAt` on table `user_subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_subscriptions" ALTER COLUMN "expiresAt" SET NOT NULL;
