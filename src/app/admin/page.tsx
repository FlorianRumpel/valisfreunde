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
import ActionButton from "@/components/action-button";

async function page() {
  const cookieStore = await cookies();

  if (
    cookieStore.get("admin_token") == undefined ||
    cookieStore.get("admin_token")?.value !== process.env.ADMIN_TOKEN
  ) {
    redirect("/login");
  }

  const requests = await prisma.entry.findMany({orderBy: {pq0: "asc"}});

  async function togglePublish(id: number, uploadURL: string) {
    "use server";

    const entry = await prisma.entry.findUnique({where: {id}});
    await prisma.entry.update({
      where: {id},
      data: {published: !entry?.published},
    });
    revalidatePath("/admin");
  }

  async function deleteEntry(id: number, uploadURL: string) {
    "use server";
    await prisma.entry.delete({where: {id}});

    deleteImage(uploadURL);
    revalidatePath("/admin");
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
      <div className="w-full mt-4 sm:w-[75%] grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((req) => (
          <div key={req.id}>
            <FeedPersonDescription req={req} />
            <div className="flex justify-between">
              <ActionButton
                variant={"outline"}
                id={req.id}
                uploadURL={req.uploadURL!}
                action={togglePublish}
                className={`${
                  req.published
                    ? "text-green-600 hover:text-green-600"
                    : "text-red-600 hover:text-red-600"
                },
                    "hover:scale-90"`}
              >
                {req.published ? (
                  <Eye className="mr-2 h-4 w-4" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                {req.published ? "Veröffentlicht" : "Nicht veröffentlicht"}
              </ActionButton>

              <AlertDialog>
                <AlertDialogTrigger asChild>
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
                      <ActionButton
                        action={deleteEntry}
                        id={req.id}
                        uploadURL={req.uploadURL!}
                      />
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
