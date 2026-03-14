import { Entry } from "@/generated/prisma";
import {
  questionKeys,
  questions,
  RatingKey,
  SliderItem,
  strikeThroughLabels,
} from "@/lib/constants";
import { displayEmoji } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";

function FeedPersonDescription({ req }: { req: Entry }) {
  const url =
    req.uploadURL == "no-picture.png"
      ? "/no-picture.png"
      : `/api/images/${req.uploadURL}`;
  const sliders = req.sliders as Record<RatingKey, SliderItem>;

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
        {sliders.mood.enabled && (
          <div>
            <strong>So bin ich heute drauf:</strong>{" "}
            {displayEmoji(sliders.mood.value, "mood")}
          </div>
        )}
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

        <div>
          <strong>Das mag ich: </strong>
          {req.strikeThrough.map((label, i) => {
            if (label == false) return;
            return (
              <Button
                type="button"
                variant={"default"}
                key={i}
                className={`px-2 py-1 border rounded ${!label && "line-through"}`}
              >
                {strikeThroughLabels[i]}
              </Button>
            );
          })}
        </div>
        <div className="mt-4">
          <strong>Das mag ich nicht: </strong>
          {req.strikeThrough.map((label, i) => {
            if (label == true) return;
            return (
              <Button
                type="button"
                variant={"outline"}
                key={i}
                className={`px-2 py-1 border rounded `}
              >
                {strikeThroughLabels[i]}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FeedPersonDescription;
