"use client";
import {revalidateFeed, toggleLike} from "@/app/actions/actions";
import {Heart} from "lucide-react";
import {useEffect, useState} from "react";
import {Button} from "./ui/button";

function LikeButton({friend}: any) {
  const [likesPerPost, setLikesPerPost] = useState<string[]>(friend.likes);
  const [likeButtonDisabled, setLikeButtonDisabled] = useState<boolean>(false);
  const [anonId, setAnonId] = useState("");

  useEffect(() => {
    async function getData() {
      const json = await fetch("/api/get-anonId");
      const data = await json.json();
      setAnonId(data.id);
    }
    getData();
  }, []);

  const isLikedByMe = anonId !== "" && likesPerPost.includes(anonId);
  const totalLikes = likesPerPost.length;

  async function like(postId: number) {
    setLikeButtonDisabled(true);
    const newLikes = await toggleLike(anonId, postId);
    await revalidateFeed();
    if (!newLikes) return;
    setLikesPerPost(newLikes);

    setLikeButtonDisabled(false);
  }

  return (
    <div>
      <Button
        onClick={() => like(friend.id)}
        disabled={likeButtonDisabled}
        className="ml-auto mr-4"
      >
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
}

export default LikeButton;
