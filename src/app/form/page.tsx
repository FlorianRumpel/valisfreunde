"use client";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {toast} from "sonner";

import {useRef, useState} from "react";
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
import {uploadImage} from "../actions/upload";
import {Spinner} from "@/components/ui/spinner";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";

export default function FreundebuchForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pq0: undefined,
    },
  });

  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isloading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    let imageName = "no-picture.png";
    if (data.upload) {
      imageName = await uploadImage(data.upload);
    }

    const payload = {
      ...data,
      uploadURL: imageName,
    };
    delete payload.upload;

    form.reset();
    inputRef.current!.value = "";
    setPreview(undefined);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      setIsLoading(false);
      toast.success("Dein Eintrag wurde erfolgreich gesendet!", {
        position: "top-center",
        richColors: true,
        description: "Dein Eintrag wird überprüft werden",
      });
    } catch (e) {
      console.error(e);
      toast.error("Etwas ist schief gelaufen. Bitte versuche es erneut.");
    }
  }

  type FormKeys = keyof z.infer<typeof formSchema>;
  type QuestionKeys = Extract<FormKeys, `pq${string}` | `vq${string}`>;

  return (
    <div className="mb-8 mx-4 flex  flex-col items-center">
      <div className="flex items-center mt-4">
        <Link href={"/"} className="md:absolute md:left-4 md:top-4 mr-8">
          <Button>
            <ArrowLeft />
          </Button>
        </Link>

        <p className="leading-7 ">
          Gib dir mühe, denn nur die Besten Einträge werden veröffentlicht!
        </p>
      </div>

      <div className="w-full sm:w-1/2 mt-4 flex flex-col gap-6 items-center">
        <form
          className="w-full mt-4  flex flex-col gap-6 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Beantworte zuerst ein Paar fragen über dich!
              </CardTitle>
              <CardDescription>Fülle alles sorgfältig aus.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
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

                            <Textarea
                              placeholder=""
                              {...field}
                              value={field.value ?? ""}
                            />
                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error.message}
                              </FieldError>
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

                <Controller
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
                        ref={inputRef}
                      />

                      {preview && (
                        <div className="max-w-60 md:max-w-96 aspect-square ">
                          <img
                            alt="profile picture"
                            src={preview}
                            loading="eager"
                            className="object-cover aspect-square rounded mt-2  mx-auto"
                          />
                        </div>
                      )}

                      <FieldDescription>
                        Wähle ein Bild von dir aus.
                      </FieldDescription>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
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
                            <Textarea
                              placeholder=""
                              {...field}
                              rows={3}
                              value={field.value ?? ""}
                            />
                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error.message}
                              </FieldError>
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
        </form>
        <div className="flex self-end gap-4 mt-4">
          <Button variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            disabled={isloading}
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isloading && <Spinner className="size-6 " />}
            Absenden
          </Button>
        </div>
      </div>
    </div>
  );
}
