import FeedPersonDescription from "@/components/feed-person";
import SelectFilter from "@/components/select-filter";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
// import SelectFilter from "@/components/select-filter";

function loading() {
  //   return (
  //     <div className="flex text-5xl justify-center mt-4 items-center">
  //       <p>Es lädt...</p>
  //       <Spinner className="size-12 ml-2" />
  //     </div>
  //   );
  const friends = [
    {
      id: 60,
      pq0: "Vali’s freundin",
      pq1: "Vali’s beste freundin",
      pq2: "Das was vali mag",
      pq3: "Vali kennen",
      pq4: "Mit vali chillen",
      vq0: "Sehr cool ",
      vq1: "Dass sie so cool ist",
      vq2: "Alle!",
      vq3: "Bleib so cool wie du bist",
      vq4: "Dass sie cool bleibt",
      uploadURL: "no-picture.png",
      published: true,
      createdAt: "2025-12-06T20:53:37.830Z",
      likes: [
        "d091c32b-4100-4266-aa8e-6caf4d85b93e",
        "ddf92278-74e3-4af9-adbb-53fb86042c78",
      ],
    },
    {
      id: 61,
      pq0: "Vali’s freundin",
      pq1: "Vali’s beste freundin",
      pq2: "Das was vali mag",
      pq3: "Vali kennen",
      pq4: "Mit vali chillen",
      vq0: "Sehr cool ",
      vq1: "Dass sie so cool ist",
      vq2: "Alle!",
      vq3: "Bleib so cool wie du bist",
      vq4: "Dass sie cool bleibt",
      uploadURL: "no-picture.png",
      published: true,
      createdAt: "2025-12-06T20:53:37.830Z",
      likes: [
        "d091c32b-4100-4266-aa8e-6caf4d85b93e",
        "ddf92278-74e3-4af9-adbb-53fb86042c78",
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center mt-4 relative">
      <div className="absolute left-4">
        <Button>
          <ArrowLeft />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row ">
        <h1 className="">Hier findest du Valis Freunde!</h1>
        <SelectFilter filter="most-likes" />
      </div>
      <div className="w-full mt-4 sm:w-[75%] grid grid-cols-1 lg:grid-cols-2 gap-6">
        {friends.map((friend) => {
          return (
            <div className="flex flex-col px-4 mb-4" key={friend.id}>
              <FeedPersonDescription req={friend} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default loading;
