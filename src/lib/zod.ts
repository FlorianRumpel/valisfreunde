import * as z from "zod";
import { strikeThroughLabels } from "./constants";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 1MB

export const formSchema = z.object({
  strikeThrough: z
    .array(z.boolean())
    .length(strikeThroughLabels.length)
    .optional(),

  sliders: z
    .record(
      z.string(),
      z.object({
        enabled: z.boolean().optional(),
        value: z.number().optional(),
      }),
    )
    .optional(),

  name: z
    .string({ error: "Bitte beantworte die Frage" })
    .max(200)
    .min(1, "Bitte beantworte die Frage"),
  pq0: z.string().max(200).optional(),
  pq1: z.string().max(200).optional(),
  pq2: z.string().max(200).optional(),
  pq3: z.string().max(200).optional(),
  vq0: z.string().max(200).optional(),
  vq1: z.string().max(200).optional(),
  vq2: z.string().max(200).optional(),
  vq3: z.string().max(200).optional(),
  vq4: z.string().max(200).optional(),
  upload: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= MAX_FILE_SIZE;
      },
      {
        error: `Datei darf maximal ${MAX_FILE_SIZE / 1024 / 1024}MB groß sein`,
      },
    ),
});
