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

  return (
    <Select
      defaultValue={searchParams.get("filter") ?? "most-likes"}
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
