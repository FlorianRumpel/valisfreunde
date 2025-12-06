import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
  const friends = await prisma.entry.findMany({
    orderBy: {pq0: "asc"},
    where: {published: true},
  });

  return NextResponse.json(friends, {
    headers: {
      "Cache-control": "public, max-age=30",
    },
  });
}
