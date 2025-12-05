import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {randomUUID} from "crypto";

export async function GET() {
  const cookieStore = await cookies();

  const existing = cookieStore.get("anonId")?.value;

  if (!existing) {
    const newId = randomUUID();
    cookieStore.set({
      name: "anonId",
      value: newId,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
    });
    return NextResponse.json({id: newId});
  }

  return NextResponse.json({id: existing});
}
