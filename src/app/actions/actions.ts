"use server";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function toggleLike(anonId: string, postId: number) {
  const post = await prisma.entry.findUnique({
    where: {id: postId},
    select: {likes: true},
  });
  if (!post) return;
  const {likes} = post;

  if (!post?.likes.includes(anonId)) {
    const newLikes = [...likes, anonId];
    await prisma.entry.update({where: {id: postId}, data: {likes: newLikes}});
    return newLikes;
  } else {
    const newLikes = likes.filter((like) => like != anonId);
    await prisma.entry.update({
      where: {id: postId},
      data: {likes: newLikes},
    });
    return newLikes;
  }
}

export async function revalidateFeed() {
  revalidatePath("feed");
}
