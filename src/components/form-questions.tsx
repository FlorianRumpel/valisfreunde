import {Questions, questions} from "@/lib/constants";
import {Controller} from "react-hook-form";
import {Field, FieldError, FieldLabel} from "./ui/field";
import {Textarea} from "./ui/textarea";
import {formSchema} from "@/lib/zod";
import z from "zod";

type PropType = {
  form: any;
  type: "vq" | "pq";
  questions: Questions;
};

function FormQuestions({form, type, questions}: PropType) {
  type FormKeys = keyof z.infer<typeof formSchema>;

  type QuestionKeys = Extract<FormKeys, `pq${string}` | `vq${string}`>;

  return (
    <>
      {Object.entries(questions).map(([key, value]) => {
        return (
          key.startsWith(type) && (
            <Controller
              key={key}
              name={key as QuestionKeys}
              control={form.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{key.startsWith(type) && value.text}</FieldLabel>
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
    </>
  );
}

export default FormQuestions;
