"use client";
import FeedPersonDescription from "@/components/feed-person";
import {useEffect, useState} from "react";

function page() {
  const [friends, setFriends] = useState<any[]>([]); // <- als leeres Array starten
  const [loading, setLoading] = useState(true);
  const [anonId, setAnonId] = useState("");

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

  if (loading) return <div className="flex justify-center mt-8">Lädt...</div>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-4">Hier findest du Valis Freunde!</h1>

      <div className="w-full mt-4 sm:w-[75%] grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {friends.map((friend: any) => (
          <FeedPersonDescription key={friend.id} req={friend} />
        ))}
      </div>
    </div>
  );
}

export default page;
