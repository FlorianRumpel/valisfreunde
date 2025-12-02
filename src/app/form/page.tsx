"use client";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {storage} from "@/lib/firebase";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {formSchema} from "@/lib/zod";
import {questions} from "@/lib/objects";

export default function FreundebuchForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pq0: "Florian",
      pq1: "Ich bin ein freundlicher und hilfsbereiter Mensch.",
      pq2: "Pizza",
      pq3: "Ich kann gut jonglieren.",
    },
  });

  const [preview, setPreview] = useState<string>();
  // async function uploadImage(file: File): Promise<string> {
  //   if (!file) return "";

  //   // Optional: prüfen auf Größe (z.B. max 2MB)
  //   const maxSizeMB = 2;
  //   if (file.size / 1024 / 1024 > maxSizeMB) {
  //     throw new Error(`Datei darf maximal ${maxSizeMB}MB groß sein`);
  //   }

  //   const fileRef = ref(storage, `freundebuch/${Date.now()}-${file.name}`);
  //   await uploadBytes(fileRef, file);

  //   const url = await getDownloadURL(fileRef);
  //   return url;
  // }
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // let imageUrl = "";
    // if (data.upload) {
    //   imageUrl = await uploadImage(data.upload);
    // }
    // const payload = {
    //   ...data,
    //   uploade: imageUrl,
    // };
    console.log("Eintrag gesendet:", data);
    form.reset();
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error(e);
    }
  }

  type FormKeys = keyof z.infer<typeof formSchema>;
  type QuestionKeys = Extract<FormKeys, `pq${string}` | `vq${string}`>;

  return (
    <div className="mx-4 flex justify-center flex-col">
      <p className="leading-7 mt-4">
        Gib dir mühe denn nur die Besten Einträge werden veröffentlicht!
      </p>

      <form
        className="w-full mt-4 sm:w-1/2 flex flex-col gap-6 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle>Beantworte zuerst ein Paar fragen über dich!</CardTitle>
            <CardDescription>Fülle alles sorgfältig aus.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {/* <Controller
              rules={{
                validate: (file) => {
                  if (!file) return true; // optional
                  const maxSizeMB = 1;
                  if (file.size / 1024 / 1024 > maxSizeMB) {
                    return `Datei darf maximal ${maxSizeMB}MB groß sein`;
                  }
                  return true;
                },
              }}
              name="upload"
              control={form.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Foto hochladen (optional)</FieldLabel>

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);

                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          setPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      } else {
                        setPreview(undefined);
                      }
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />

                  {preview && <img src={preview} className="mt-2 rounded" />}

                  <FieldDescription>
                    Wähle ein Bild von dir aus.
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            /> */}

              {Object.entries(questions).map(([key, value]) => {
                return (
                  key.startsWith("pq") && (
                    <Controller
                      key={key}
                      name={key as QuestionKeys}
                      control={form.control}
                      render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            {key.startsWith("pq") && value}
                          </FieldLabel>
                          <Textarea placeholder="" {...field} rows={3} />
                          {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                          )}
                          {/* <FieldDescription>
                        Optional: Schreibe etwas Lustiges oder Nettes.
                      </FieldDescription> */}
                        </Field>
                      )}
                    />
                  )
                );
              })}
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jetzt beantworte ein Paar fragen zu Vali!</CardTitle>
            <CardDescription>Fülle alles sorgfältig aus.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {Object.entries(questions).map(([key, value]) => {
                return (
                  key.startsWith("vq") && (
                    <Controller
                      key={key}
                      name={key as QuestionKeys}
                      control={form.control}
                      render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            {key.startsWith("vq") && value}
                          </FieldLabel>
                          <Textarea placeholder="" {...field} rows={3} />
                          {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                          )}
                          {/* <FieldDescription>
                          Optional: Schreibe etwas Lustiges oder Nettes.
                        </FieldDescription> */}
                        </Field>
                      )}
                    />
                  )
                );
              })}
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Absenden
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
