/*
  Warnings:

  - Added the required column `creator` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "creator" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Групповой чат';
