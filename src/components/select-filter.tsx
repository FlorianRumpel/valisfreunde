"use client";
import {useRouter, useSearchParams} from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function SelectFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  function setFilter(filter: Filters) {
    router.push(`?filter=${filter}`);
  }
  const rawFilter = searchParams.get("filter") ?? "most-likes";

  const filter: Filters =
    rawFilter === "most-likes" ||
    rawFilter === "newest" ||
    rawFilter === "oldest"
      ? rawFilter
      : "most-likes";
  return (
    <Select
      defaultValue={filter}
      onValueChange={(value: Filters) => setFilter(value)}
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
  );
}

export default SelectFilter;
