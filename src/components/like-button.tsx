import {toggleLike} from "@/app/actions/actions";
import {Entry} from "@/generated/prisma";
import {useState} from "react";
import {Button} from "./ui/button";
import {Heart} from "lucide-react";

function LikeButton({friend, anonId}: {friend: Entry; anonId: string}) {
  const [likesPerPost, setLikesPerPost] = useState<string[]>(friend.likes);
  const [likeButtonDisabled, setLikeButtonDisabled] = useState<boolean>(false);

  const isLikedByMe = anonId !== "" && likesPerPost.includes(anonId);
  const totalLikes = likesPerPost.length;

  async function like(postId: number) {
    setLikeButtonDisabled(true);
    const newLikes = await toggleLike(anonId, postId);
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
