import {Button} from "@/components/ui/button";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {deleteImage} from "../actions/upload";
import FeedPersonDescription from "@/components/feed-person";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {ButtonGroup} from "@/components/ui/button-group";
import {Eye, EyeOff, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";

async function page() {
  const cookieStore = await cookies();

  if (
    cookieStore.get("admin_token") == undefined ||
    cookieStore.get("admin_token")?.value !== process.env.ADMIN_TOKEN
  ) {
    redirect("/login");
  }

  const requests = await prisma.entry.findMany({orderBy: {pq0: "asc"}});

  async function togglePublish(data: FormData) {
    "use server";

    const id: number = Number(data.get("id"));
    const entry = await prisma.entry.findUnique({where: {id}});
    await prisma.entry.update({
      where: {id},
      data: {published: !entry?.published},
    });
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
    <div className="flex p-4 flex-col  items-center">
      <form className="sm:ml-auto " action={logout}>
        <Button type="submit">Ausloggen</Button>
      </form>
      <div className="flex flex-wrap gap-4 p-4">
        {requests.map((req) => (
          <div key={req.id}>
            <FeedPersonDescription req={req} />
            <div className="flex justify-between">
              <form action={togglePublish} className={"flex items-center"}>
                <input type="number" hidden defaultValue={req.id} name="id" />
                <Button
                  type="submit"
                  variant={"outline"}
                  className={cn(
                    req.published
                      ? "text-green-600 hover:text-green-600"
                      : "text-red-600 hover:text-red-600",
                    "hover:scale-90",
                  )}
                >
                  {req.published ? (
                    <Eye className="mr-2 h-4 w-4" />
                  ) : (
                    <EyeOff className="mr-2 h-4 w-4" />
                  )}
                  {req.published ? "Veröffentlicht" : "Nicht veröffentlicht"}
                </Button>
              </form>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive">
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bist du dir wirklich sicher?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Dies kann nicht rückganging gemacht werden!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <form action={deleteEntry}>
                        <input
                          type="number"
                          hidden
                          defaultValue={req.id}
                          name="id"
                        />
                        <input
                          type="text"
                          hidden
                          defaultValue={req.uploadURL!}
                          name="uploadURL"
                        />
                        <Button type="submit">Fortfahren</Button>
                      </form>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
