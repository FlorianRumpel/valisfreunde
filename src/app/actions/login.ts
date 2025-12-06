"use server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export async function loginAction(data: FormData) {
  const username = data.get("username");
  const password = data.get("password");
  console.log(username, password);
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return false;
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: "admin_token",
    value: process.env.ADMIN_TOKEN!,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");

  return true;
}
