import FeedPersonDescription from "@/components/feed-person";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {Entry} from "@/generated/prisma";

import Link from "next/link";
import LikeButton from "@/components/like-button";

import SelectFilter from "@/components/select-filter";
import prisma from "@/lib/prisma";

async function Page({searchParams}: any) {
  const friends: Entry[] = await prisma.entry.findMany({
    where: {published: true},
  });

  const rawFilter = (await searchParams).filter ?? "most-likes";
  console.log(rawFilter);

  const filter: Filters =
    rawFilter === "most-likes" ||
    rawFilter === "newest" ||
    rawFilter === "oldest"
      ? rawFilter
      : "most-likes";

  function filterPosts(filter: Filters) {
    let filteredFriends = [];
    switch (filter) {
      case "most-likes":
        filteredFriends = friends.sort(
          (a, b) => b.likes.length - a.likes.length,
        );
        break;
      case "newest":
        filteredFriends = friends.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filteredFriends = friends.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
    }
    return filteredFriends;
  }

  return (
    <div className="flex flex-col items-center mt-4 relative">
      <Link href={"/"} className="absolute left-4">
        <Button>
          <ArrowLeft />
        </Button>
      </Link>

      <div className="flex flex-col items-center gap-4 sm:flex-row ">
        <h1 className="">Hier findest du Valis Freunde!</h1>
        <SelectFilter />
      </div>
      <div className="w-full mt-4 sm:w-[75%] grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filterPosts(filter).map((friend) => {
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
