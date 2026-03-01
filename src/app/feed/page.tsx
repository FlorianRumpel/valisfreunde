import BackButton from "@/components/back-button";
import SelectFilter from "@/components/select-filter";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { Filters } from "@/lib/types";
import { filterPosts } from "@/lib/utils";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

async function Page({ searchParams }: any) {
  const friends = await prisma.entry.findMany({
    where: { published: true },
    select: { id: true, likes: true, name: true, createdAt: true },
  });

  const rawFilter = (await searchParams).filter ?? "most-likes";
  const filter: Filters =
    rawFilter === "most-likes" ||
    rawFilter === "newest" ||
    rawFilter === "oldest"
      ? rawFilter
      : "most-likes";

  if (friends.length !== 0)
    return (
      <>
        <BackButton />
        <div className="flex flex-col items-center mt-4 relative">
          <div className="flex flex-col items-center gap-4 sm:flex-row ">
            <h1 className="">Hier findest du Valis Freunde!</h1>
            <SelectFilter filter={filter} />
          </div>
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 w-full sm:w-1/2 px-12 sm:p-0 mt-4">
            {filterPosts(filter, friends).map((friend) => {
              return (
                <Card key={friend.id} className="p-3 shadow-sm">
                  <CardHeader className="p-0 ">
                    <CardTitle className=" font-medium truncate">
                      {friend.name}
                    </CardTitle>
                  </CardHeader>
                  <div className="text-muted-foreground  flex items-center">
                    <Heart fill="red" stroke="none" className="mr-2" />
                    {friend.likes.length}
                  </div>
                  <CardFooter className="p-0">
                    <Link href={`/details/${friend.id}`} prefetch={true}>
                      <Button className="py-1.5 px-3  h-auto">Anschauen</Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </>
    );
  else
    return (
      <div className="flex items-center flex-col mt-6 gap-4">
        <p>Es sind noch keine Einträge vorhanden.</p>
        <Link href={"/form"}>
          <Button>Sende hier eine Freundesanfrage</Button>
        </Link>
      </div>
    );
}

export default Page;
