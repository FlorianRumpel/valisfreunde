import {Button} from "@/components/ui/button";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {deleteImage} from "../actions/upload";
import Image from "next/image";
import FeedPersonDescription from "@/components/feed-person";

async function page() {
  const cookieStore = await cookies();

  if (
    cookieStore.get("admin_token") == undefined ||
    cookieStore.get("admin_token")?.value !== process.env.ADMIN_TOKEN
  ) {
    redirect("/login");
  }

  const requests = await prisma.entry.findMany({orderBy: {pq0: "asc"}});

  async function approve(data: FormData) {
    "use server";

    const id: number = Number(data.get("id"));
    await prisma.entry.update({
      where: {id},
      data: {published: true},
    });
    revalidatePath("/admin");
    redirect("/admin");
  }

  async function unpublish(data: FormData) {
    "use server";
    const id: number = Number(data.get("id"));
    await prisma.entry.update({where: {id}, data: {published: false}});
    revalidatePath("/admin");
    redirect("/admin");
  }

  async function deleteEntry(data: FormData) {
    "use server";
    const id: number = Number(data.get("id"));
    await prisma.entry.delete({where: {id}});

    const fileName = data.get("uploadURL")?.toString().split("/").pop();
    deleteImage(fileName!);
    revalidatePath("/admin");
    redirect("/admin");
  }

  async function logout() {
    "use server";

    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
  }

  return (
    <div className="flex p-4">
      <div className="flex flex-wrap gap-4 p-4">
        {requests.map((req) => (
          <div key={req.id}>
            <FeedPersonDescription req={req} />
            <div className="flex flex-col gap-4">
              <form action={approve}>
                <input type="number" hidden defaultValue={req.id} name="id" />
                <Button type="submit">Annehmen und veröffentlichen</Button>
              </form>
              <form action={unpublish}>
                <input type="number" hidden defaultValue={req.id} name="id" />
                <Button type="submit">Unveröffentlichen</Button>
              </form>
              <form action={deleteEntry}>
                <input type="number" hidden defaultValue={req.id} name="id" />
                <input
                  type="text"
                  hidden
                  defaultValue={req.uploadURL!}
                  name="uploadURL"
                />

                <Button variant={"destructive"} type="submit">
                  Vollständig und für immer Löschen
                </Button>
              </form>
            </div>
            <p className={req.published ? "text-green-600" : "text-red-600"}>
              Status:{" "}
              {req.published ? "Veröffentlicht" : "Nicht veröffentlicht"}
            </p>
          </div>
        ))}
      </div>
      <form action={logout}>
        <Button type="submit">Ausloggen</Button>
      </form>
    </div>
  );
}

export default page;
