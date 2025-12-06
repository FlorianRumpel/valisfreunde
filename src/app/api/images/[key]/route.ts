import {GetObjectCommand} from "@aws-sdk/client-s3";
import {NextRequest, NextResponse} from "next/server";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
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
    const url = await getSignedUrl(r2Client, command, {expiresIn: 60});

    return NextResponse.redirect(url, {
      headers: {
        "Cache-control": "public, max-age=30",
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
