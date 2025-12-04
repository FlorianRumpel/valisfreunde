import prisma from "@/lib/prisma";
import Image from "next/image";

async function page() {
  const friends = await prisma.entry.findMany({
    orderBy: {pq0: "asc"},
    where: {published: true},
  });
  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-4">Hier findest du Valis Freunde!</h1>

      <div className="w-full mt-4 sm:w-1/2 flex flex-col gap-6 ">
        {friends.map((friend) => (
          <div key={friend.id} className="mb-8 p-4 border rounded-lg">
            <img
              alt="profile picture"
              src={friend.uploadURL!}
              width={300}
              height={300}
            />
            <h2 className="text-2xl font-bold mb-2">{friend.pq0}</h2>
            <p className="mb-1">
              <strong>Über mich:</strong> {friend.pq1}
            </p>
            <p className="mb-1">
              <strong>Lieblingsessen:</strong> {friend.pq2}
            </p>
            <p className="mb-1">
              <strong>Verborgenes Talent:</strong> {friend.pq3}
            </p>
            <p className="mb-1">
              <strong>Freizeitaktivität:</strong> {friend.pq4}
            </p>
            <hr className="my-4" />
            <p className="mb-1">
              {" "}
              <strong>Über Vali:</strong> {friend.vq0}
            </p>
            <p className="mb-1">
              <strong>Was ich an Vali schätze:</strong> {friend.vq1}
            </p>
            <p className="mb-1">
              <strong>Lustige Erinnerung mit Vali:</strong> {friend.vq2}
            </p>
            <p className="mb-1">
              <strong>Was ich Vali schon immer mal sagen wollte:</strong>{" "}
              {friend.vq3}
            </p>
            <p className="mb-1">
              <strong>Wünsche für Valis Zukunft:</strong> {friend.vq4}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
