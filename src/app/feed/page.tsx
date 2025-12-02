import prisma from "@/lib/prisma";

async function page() {
  console.log(await prisma.entry.findMany());
  return (
    <div>
      <h1>Hier findest du Valis Freunde!</h1>
    </div>
  );
}

export default page;
