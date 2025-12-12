import {GetObjectCommand} from "@aws-sdk/client-s3";
import {NextRequest, NextResponse} from "next/server";
import {r2Client} from "@/lib/r2client";

export async function GET(
  req: NextRequest,
  {params}: {params: Promise<{key: string}>},
) {
  const {key} = await params;
  if (!key) return NextResponse.json({error: "Missing key"}, {status: 400});

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    const res = await r2Client.send(command);

    return new Response(res.Body as any, {
      headers: {
        "Content-Type": res.ContentType ?? "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {error: "Error fetching R2 object"},
      {status: 500},
    );
  }
}
