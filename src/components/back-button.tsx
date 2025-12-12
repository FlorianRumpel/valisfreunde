"use client";
import {ArrowLeft} from "lucide-react";
import {Button} from "./ui/button";
import {useRouter} from "next/navigation";

function BackButton({path}: {path?: string}) {
  const router = useRouter();
  return (
    <Button onClick={() => router.replace(path ?? "/")} className="mt-4 ml-4">
      <ArrowLeft />
    </Button>
  );
}

export default BackButton;
