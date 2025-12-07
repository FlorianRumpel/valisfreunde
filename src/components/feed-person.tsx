import Image from "next/image";

function FeedPersonDescription({req}: any) {
  return (
    <div key={req.id} className="mb-4 p-4 border rounded-lg ">
      <div className="flex justify-center">
        <div className="relative w-80  md:w-96 aspect-4/4">
          {req.uploadURL != "no-picture.png" ? (
            <img
              alt="profile picture"
              src={`/api/images/${req.uploadURL}`}
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover w-full h-auto aspect-4/4 rounded"
            />
          ) : (
            <Image
              alt="profile picture"
              src="/no-picture.png"
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded"
            />
          )}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">{req.pq0}</h2>
        <p className="mb-1">
          <strong>Über mich:</strong> {req.pq1}
        </p>
        <p className="mb-1">
          <strong>Lieblingsessen:</strong> {req.pq2}
        </p>
        <p className="mb-1">
          <strong>Verborgenes Talent:</strong> {req.pq3}
        </p>
        <p className="mb-1">
          <strong>Freizeitaktivität:</strong> {req.pq4}
        </p>
        <hr className="my-4" />
        <p className="mb-1">
          <strong>Über Vali:</strong> {req.vq0}
        </p>
        <p className="mb-1">
          <strong>Was ich an Vali schätze:</strong> {req.vq1}
        </p>
        <p className="mb-1">
          <strong>Lustige Erinnerung mit Vali:</strong> {req.vq2}
        </p>
        <p className="mb-1">
          <strong>Was ich Vali schon immer mal sagen wollte:</strong> {req.vq3}
        </p>
        <p className="mb-1">
          <strong>Wünsche für Valis Zukunft:</strong> {req.vq4}
        </p>
      </div>
    </div>
  );
}

export default FeedPersonDescription;
