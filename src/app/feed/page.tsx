"use client";
import FeedPersonDescription from "@/components/feed-person";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {Heart} from "lucide-react";
import {toggleLike} from "../actions/actions";

// Typen (optional, aber hilfreich)
type Friend = {
  id: number;
  // weitere Felder...
  likes?: string[]; // falls API initial Likes liefert
};

function Page() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [anonId, setAnonId] = useState("");
  // likesPerPost: { [postId]: string[] } -> Liste von anonIds die den Post geliked haben
  const [likesPerPost, setLikesPerPost] = useState<Record<number, string[]>>(
    {},
  );

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

        const json = await postFriendsData.json();
        setFriends(json);

        // Wenn die API pro Post bereits eine Liste mit Likes (anonIds) liefert, initial setzen:
        const initialLikes: Record<number, string[]> = {};
        (json as Friend[]).forEach((f: any) => {
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

  if (loading) return <div className="flex justify-center mt-8">Lädt...</div>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-4">Hier findest du Valis Freunde!</h1>
      <div className="w-full mt-4 sm:w-[75%] grid grid-cols-1 lg:grid-cols-2 gap-6">
        {friends.map((friend) => {
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
