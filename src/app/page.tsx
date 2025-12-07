import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 mt-4 justify-center items-center w-full ">
      <p>Willkommen zu Valis Freundebuch!</p>

      <Link href={"/form"}>
        <Button>Sende eine Freundesanfrage</Button>
      </Link>

      <Link href={"/feed"}>
        <Button variant={"secondary"}>Schaue dir Valis Freunde an</Button>
      </Link>
    </div>
  );
}
