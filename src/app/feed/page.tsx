"use client";
import FeedPersonDescription from "@/components/feed-person";
import {Button} from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import {Heart} from "lucide-react";
import {toggleLike} from "../actions/actions";
import {Entry} from "@/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

        const postFriendsData = await fetch("/api/feed", {signal: ac.signal});
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

  async function like(postId: number) {
    if (!anonId) {
      console.warn("anonId fehlt noch");
      return;
    }

    // toggleLike erwartet (anonId, postId) und soll idealerweise die aktuelle Liste der userIds zurückgeben
    const newLikes = await toggleLike(anonId, postId);
    // newLikes sollte ein string[] sein (Liste von anonIds), ansonsten passe an
    if (!newLikes) return;

    setLikesPerPost((prev) => ({...prev, [postId]: newLikes}));
  }

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

  if (loading) return <div className="flex justify-center mt-8">Lädt...</div>;
  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-4">Hier findest du Valis Freunde!</h1>
      <div className="self-end mr-4 mt-2">
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
          const likedBy = likesPerPost[friend.id] ?? [];
          const isLikedByMe = anonId !== "" && likedBy.includes(anonId);
          const totalLikes = likedBy.length;
          return (
            <div className="flex flex-col" key={friend.id}>
              <FeedPersonDescription req={friend} />
              <Button onClick={() => like(friend.id)} className="ml-auto mr-4">
                {totalLikes == 0 ? "" : totalLikes}
                {isLikedByMe ? (
                  // gefüllt ohne Outline; Größe via Tailwind
                  <Heart
                    fill="red"
                    stroke="none"
                    className="w-6 h-6"
                    aria-label="Gefällt mir"
                  />
                ) : (
                  // transparent fill + sichtbare Stroke (Outline)
                  <Heart
                    fill="transparent"
                    strokeWidth={2}
                    className="w-6 h-6"
                    aria-label="Gefällt mir"
                  />
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
