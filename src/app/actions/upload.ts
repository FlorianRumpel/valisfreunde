"use server";

import {r2Client} from "@/lib/r2client";
import {PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";

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

  return fileName;
}

export async function deleteImage(fileName: string) {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
    }),
  );
}
