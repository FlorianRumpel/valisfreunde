import FeedPersonDescription from "@/components/feed-person";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {Entry} from "@/generated/prisma";
import Link from "next/link";
import LikeButton from "@/components/like-button";
import prisma from "@/lib/prisma";
import SelectFilter from "@/components/select-filter";
import {filterPosts} from "@/lib/utils";

export const revalidate = 30;

async function Page({searchParams}: any) {
  const friends: Entry[] = await prisma.entry.findMany({
    where: {published: true},
  });

  const rawFilter = (await searchParams).filter ?? "most-likes";
  const filter: Filters =
    rawFilter === "most-likes" ||
    rawFilter === "newest" ||
    rawFilter === "oldest"
      ? rawFilter
      : "most-likes";

  return (
    <div className="flex flex-col items-center mt-4 relative">
      <Link href={"/"} className="absolute left-4">
        <Button>
          <ArrowLeft />
        </Button>
      </Link>

      <div className="flex flex-col items-center gap-4 sm:flex-row ">
        <h1 className="">Hier findest du Valis Freunde!</h1>

        <SelectFilter filter={filter} />
      </div>

      <div className="w-full mt-4 sm:w-[75%] grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filterPosts(filter, friends).map((friend) => {
          return (
            <div className="flex flex-col px-4 mb-4" key={friend.id}>
              <FeedPersonDescription req={friend} />
              <LikeButton friend={friend} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
