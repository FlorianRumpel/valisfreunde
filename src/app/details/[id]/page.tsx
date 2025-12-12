import BackButton from "@/components/back-button";
import FeedPersonDescription from "@/components/feed-person";
import LikeButton from "@/components/like-button";
import prisma from "@/lib/prisma";
import {redirect} from "next/navigation";

export const revalidate = 30;

async function page({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;

  if (isNaN(Number(id))) redirect("/feed");

  const friend = await prisma.entry.findUnique({where: {id: Number(id)}});

  if (!friend) redirect("/feed");

  return (
    <div>
      <BackButton path="/feed" />
      <div className="w-[75%] sm:w-1/2 mx-auto mt-4">
        <FeedPersonDescription req={friend} />
        <LikeButton friend={friend} />
      </div>
    </div>
  );
}

export default page;
