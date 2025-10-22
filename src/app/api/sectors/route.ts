import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const galaxyId = parseInt(searchParams.get("galaxyId") || "0");
  if (!galaxyId) return NextResponse.json([], { status: 400 });
  const sectors = await prisma.sector.findMany({
    where: { galaxyId },
    include: { posts: true },
  });
  return NextResponse.json(sectors);
}
