-- CreateTable
CREATE TABLE "Galaxy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "communities" INTEGER NOT NULL DEFAULT 0,
    "positionX" REAL NOT NULL,
    "positionY" REAL NOT NULL,
    "size" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Sector" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "galaxyId" INTEGER NOT NULL,
    CONSTRAINT "Sector_galaxyId_fkey" FOREIGN KEY ("galaxyId") REFERENCES "Galaxy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sectorId" INTEGER NOT NULL,
    CONSTRAINT "Post_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
