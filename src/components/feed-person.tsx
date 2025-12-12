import {Entry} from "@/generated/prisma";
import {questionKeys, questions} from "@/lib/constants";
import Image from "next/image";

function FeedPersonDescription({req}: {req: Entry}) {
  const url =
    req.uploadURL == "no-picture.png"
      ? "/no-picture.png"
      : `/api/images/${req.uploadURL}`;

  return (
    <div key={req.id} className="mb-4 p-4 border rounded-lg ">
      <div className="flex justify-center">
        <div className="relative w-80 md:w-96 aspect-square">
          <Image
            alt="profile picture"
            src={url}
            fill
            className="object-cover rounded "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">{req.name}</h2>
        {Object.entries(req).map(([key, value]) => {
          if (!key.startsWith("pq") && !key.startsWith("vq")) return;
          if (value == null || (typeof value == "string" && value.trim() == ""))
            return;

          type Key = keyof typeof questions;

          const typedKey = key as Key;
          return (
            <p key={key} className="mb-1">
              <strong>{questions[typedKey].description}</strong>{" "}
              {value?.toString()}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default FeedPersonDescription;
