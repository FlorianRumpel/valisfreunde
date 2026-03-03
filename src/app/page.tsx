import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 mt-6 justify-center items-center w-full ">
      <div className="text-center">
        <p className="text-5xl font-bold font-pacifico text-pink-600">Valis</p>
        <p className="font-bold text-3xl">Freundebuch</p>
      </div>
      <div className="mx-8 md:max-w-1/3 text-center">
        <p>
          Willkommen in meinem Digitalen Freundebuch! Lerne meine Freunde kennen
          oder hinterlasse selbst einen Eintrag für die Ewigkeit.
        </p>
      </div>

      <div className="flex gap-4 flex-col ">
        <Link href={"/feed"}>
          <Button className="w-full ">Freundebuch ansehen</Button>
        </Link>
        <Link href={"/form"}>
          <Button className="w-full" variant={"secondary"}>
            Ins Freundebuch eintragen
          </Button>
        </Link>
      </div>
    </div>
  );
}
