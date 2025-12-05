import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-4 mt-4 justify-center items-center w-full ">
      <p>Willkommen zu Valis Freundebuch!</p>

      <Button>
        <Link href={"/form"}>Sende eine Freundesanfrage</Link>
      </Button>
      <Button>
        <Link href={"/feed"}>Schaue dir Valis Freunde an</Link>
      </Button>
    </div>
  );
}
