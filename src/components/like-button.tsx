import {toggleLike} from "@/app/actions/actions";
import {Entry} from "@/generated/prisma";
import {useState} from "react";
import {Button} from "./ui/button";
import {Heart} from "lucide-react";

function LikeButton({
  friend,
  anonId,
  initialLikes,
}: {
  friend: Entry;
  anonId: string;
  initialLikes: Record<number, string[]>;
}) {
  const [likesPerPost, setLikesPerPost] =
    useState<Record<number, string[]>>(initialLikes);

  const [likeButtonDisabled, setLikeButtonDisabled] = useState<
    Record<number, boolean>
  >({});

  const likedBy = likesPerPost[friend.id] ?? [];
  const isLikedByMe = anonId !== "" && likedBy.includes(anonId);
  const totalLikes = likedBy.length;

  async function like(postId: number) {
    setLikeButtonDisabled((prev) => ({...prev, [postId]: true}));
    if (!anonId) {
      console.warn("anonId fehlt noch");
      return;
    }
    const newLikes = await toggleLike(anonId, postId);
    if (!newLikes) return;
    setLikesPerPost((prev) => ({...prev, [postId]: newLikes}));
    setLikeButtonDisabled((prev) => ({...prev, [postId]: false}));
  }

  return (
    <div>
      <Button
        onClick={() => like(friend.id)}
        disabled={
          likeButtonDisabled[friend.id] ? likeButtonDisabled[friend.id] : false
        }
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
