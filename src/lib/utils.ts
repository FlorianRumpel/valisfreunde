import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {Filters} from "./types";
import {emojis, RatingKey} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterPosts(filter: Filters, posts: any[]) {
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

export function displayEmoji(value: number | undefined, name: string) {
  if (value === undefined) return "";
  const key = name.split(".").pop();

  if (value <= 3) return emojis[key as RatingKey][3];
  if (value > 3 && value <= 6) return emojis[key as RatingKey][2];
  if (value >= 7 && value < 9) return emojis[key as RatingKey][1];
  if (value >= 9) return emojis[key as RatingKey][0];
}
