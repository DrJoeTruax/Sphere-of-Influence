import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, sectorId } = body;
    if (!title || !content || !sectorId)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const post = await prisma.post.create({
      data: { title, content, sectorId: Number(sectorId) },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
