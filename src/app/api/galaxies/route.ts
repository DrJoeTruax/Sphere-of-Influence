import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.galaxy.findMany({ include: { sectors: true } });
  return NextResponse.json(data);
}
