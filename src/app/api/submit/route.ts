// src/app/api/entries/route.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import prisma from "@/lib/prisma"; // passe Pfad an, falls nötig

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Beispiel: Prisma-Model heißt "Entry" mit Feldern title, content
    const created = await prisma.entry.create({
      data: body,
    });

    return NextResponse.json(created, {status: 201});
  } catch (err: any) {
    console.error("API /api/entries error:", err);
    return NextResponse.json(
      {error: String(err?.message ?? "Internal error")},
      {status: 500},
    );
  }
}
