import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 mt-6 justify-center items-center w-full ">
      <div className="text-center">
        <p className="text-5xl font-bold font-pacifico text-pink-600">Valis</p>
        <p className="font-bold text-3xl">Freundebuch</p>
      </div>
      <p className="w-1/2 md:max-w-1/3 ">
        Willkommen in meinem Digitalen Freundebuch! Lerne meine Freunde kennen
        oder hinterlasse selbst einen Eintrag fuer die Ewigkeit.
      </p>
      <Link href={"/form"}>
        <Button>Sende eine Freundesanfrage</Button>
      </Link>

      <Link href={"/feed"}>
        <Button variant={"secondary"}>Schaue dir Valis Freunde an</Button>
      </Link>
    </div>
  );
}
