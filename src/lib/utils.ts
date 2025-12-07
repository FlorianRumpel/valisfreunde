import {Entry} from "@/generated/prisma";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterPosts(filter: Filters, posts: Entry[]) {
  let filteredFriends = [];
  switch (filter) {
    case "most-likes":
      filteredFriends = posts.sort((a, b) => b.likes.length - a.likes.length);
      break;
    case "newest":
      filteredFriends = posts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "oldest":
      filteredFriends = posts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }
  return filteredFriends;
}
