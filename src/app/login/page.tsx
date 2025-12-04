import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

async function page() {
  async function onSubmit(data: FormData) {
    "use server";
    const username = data.get("username");
    const password = data.get("password");
    console.log(username, password);
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    )
      return;

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
  }

  return (
    <div>
      <form action={onSubmit}>
        <Input type="text" name="username" placeholder="Benutzername" />

        <Input name="password" placeholder="Admin Passwort" />

        <Button type="submit">Login als Admin</Button>
      </form>
    </div>
  );
}

export default page;
