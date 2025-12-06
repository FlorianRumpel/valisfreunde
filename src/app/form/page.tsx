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

export default function FreundebuchForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pq0: undefined,
    },
  });

  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    let imageUrl = "/no-picture.png";
    if (data.upload) {
      imageUrl = await uploadImage(data.upload);
    }

    const payload = {
      ...data,
      uploadURL: imageUrl,
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
    <div className="mb-8 mx-4 flex justify-center flex-col items-center">
      <p className="leading-7 mt-4">
        Gib dir mühe, denn nur die Besten Einträge werden veröffentlicht!
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

                    {preview && <img src={preview} className="mt-2 rounded" />}

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
      </form>

      <div className="flex justify-end gap-4 mt-4">
        <Button
          className="active:transition active:scale-90"
          variant="outline"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button
          className="active:transition active:scale-90"
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
        >
          Absenden
        </Button>
      </div>
    </div>
  );
}
