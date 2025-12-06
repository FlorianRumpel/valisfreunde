"use client";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";

import {loginAction} from "../actions/login";
import {toast} from "sonner";

function page() {
  async function handle(data: FormData) {
    const result = await loginAction(data);
    if (!result) {
      toast.error("Das Passwort oder der Benutzername ist falsch!", {
        richColors: true,
        position: "top-center",
      });
    }
  }

  return (
    <div className="flex justify-center">
      <form action={handle}>
        <Card className="w-60 sm:w-80 md:w-96 p-4 mt-4">
          <Input type="text" name="username" placeholder="Benutzername" />

          <Input type="password" name="password" placeholder="Admin Passwort" />
          <hr />
          <Button className="" type="submit">
            Login als Admin
          </Button>
        </Card>
      </form>
    </div>
  );
}

export default page;
