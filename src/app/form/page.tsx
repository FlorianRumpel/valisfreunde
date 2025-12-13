"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";

import {toast} from "sonner";

import BackButton from "@/components/back-button";
import CustomSlider from "@/components/custom-slider";
import FormQuestions from "@/components/form-questions";
import StrikeThrough from "@/components/strike-through";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {Spinner} from "@/components/ui/spinner";
import {
  defaultSliderValue,
  questions,
  RatingKey,
  SliderItem,
  sliderKeys,
} from "@/lib/constants";
import {formSchema} from "@/lib/zod";
import {useRef, useState} from "react";
import {uploadImage} from "../actions/upload";
import UploadButton from "@/components/upload-button";

export default function FreundebuchForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sliders: sliderKeys.reduce<Record<RatingKey, SliderItem>>((acc, k) => {
        acc[k] = {enabled: true, value: defaultSliderValue};
        return acc;
      }, {} as Record<RatingKey, SliderItem>),
    },
  });

  const [preview, setPreview] = useState<string>();
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

  return (
    <>
      <BackButton />
      <div className="mb-8 mx-4 flex  flex-col items-center">
        <div className="flex items-center mt-4">
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
                  <Controller
                    name="name"
                    control={form.control}
                    render={({field, fieldState}) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Wie heißt du?</FieldLabel>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            type="text"
                          />
                          {fieldState.error && (
                            <FieldError>{fieldState.error?.message}</FieldError>
                          )}
                        </Field>
                      );
                    }}
                  />
                  <CustomSlider control={form.control} name="sliders.mood" />

                  <FormQuestions questions={questions} form={form} type="pq" />
                  <StrikeThrough control={form.control} name="strikeThrough" />

                  <UploadButton
                    control={form.control}
                    name="upload"
                    preview={preview}
                    setPreview={setPreview}
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
                  <FormQuestions questions={questions} form={form} type="vq" />
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
    </>
  );
}
