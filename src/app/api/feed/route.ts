import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  const friends = await prisma.entry.findMany({
    orderBy: {pq0: "asc"},
    where: {published: true},
  });

  return NextResponse.json(friends);
}
