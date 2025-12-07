"use client";
import FeedPersonDescription from "@/components/feed-person";
import {Button} from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import {ArrowLeft} from "lucide-react";
import {Entry} from "@/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import LikeButton from "@/components/like-button";

type Filters = "most-likes" | "newest" | "oldest";

function Page() {
  const [friends, setFriends] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [anonId, setAnonId] = useState("");

  const [likesPerPost, setLikesPerPost] = useState<Record<number, string[]>>(
    {},
  );

  const [filteredFriends, setFilteredFriends] = useState<Entry[]>([]);

  useEffect(() => {
    const ac = new AbortController();

    async function getData() {
      try {
        const anonRes = await fetch("/api/get-anonId", {signal: ac.signal});
        if (anonRes.ok) {
          const {id} = await anonRes.json();
          setAnonId(id);
        } else {
          console.warn("AnonId API returned", anonRes.status);
        }

        const postFriendsData = await fetch("/api/feed", {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!postFriendsData.ok) {
          console.error("Fehler beim Laden der Posts:", postFriendsData.status);
          setFriends([]);
          return;
        }

        const friendsData = await postFriendsData.json();
        setFriends(friendsData);

        filter("most-likes", friendsData);

        const initialLikes: Record<number, string[]> = {};
        friendsData.forEach((f: Entry) => {
          initialLikes[f.id] = f.likes ?? [];
        });
        setLikesPerPost(initialLikes);
      } catch (e) {
        if ((e as any).name === "AbortError") return;
        console.error("Fetch error:", e);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    }

    getData();
    return () => ac.abort();
  }, []);

  function filter(filter: Filters, friendsToFilter?: Entry[]) {
    const list = friendsToFilter ?? friends;
    switch (filter) {
      case "most-likes":
        setFilteredFriends(
          [...list].sort((a, b) => b.likes.length - a.likes.length),
        );
        break;
      case "newest":
        setFilteredFriends(
          [...list].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        break;
      case "oldest":
        setFilteredFriends(
          [...list].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        );
        break;
    }
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <Link href={"/"} className="absolute left-4 top-4">
        <Button>
          <ArrowLeft />
        </Button>
      </Link>

      <div className="flex flex-col items-center gap-4 sm:flex-row ">
        <h1 className="">Hier findest du Valis Freunde!</h1>

        <Select
          defaultValue="most-likes"
          onValueChange={(value: Filters) => filter(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wähle einen Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most-likes">Meiste Likes</SelectItem>
            <SelectItem value="newest">Neuste</SelectItem>
            <SelectItem value="oldest">Älteste</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full mt-4 sm:w-[75%] grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFriends.map((friend) => {
          return (
            <div className="flex flex-col px-4 mb-4" key={friend.id}>
              <FeedPersonDescription req={friend} />
              <LikeButton
                friend={friend}
                initialLikes={likesPerPost}
                anonId={anonId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
