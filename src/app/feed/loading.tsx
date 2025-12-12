import {Spinner} from "@/components/ui/spinner";

function loading() {
  return (
    <div className="flex text-5xl justify-center mt-4 items-center">
      <p>Es lädt...</p>
      <Spinner className="size-12 ml-2" />
    </div>
  );
}

export default loading;
