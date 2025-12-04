"use server";

import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer); // Node Buffer mit bekannter Länge
  const fileName = Date.now() + "-" + file.name;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ContentLength: buffer.length, // optional, aber hilfreich
    }),
  );

  return `https://${process.env.R2_PUBLIC_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileName}`;
}
