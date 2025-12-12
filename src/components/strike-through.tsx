import React from "react";
import {Control, Controller} from "react-hook-form";
import {Field, FieldLabel} from "./ui/field";
import {Button} from "./ui/button";
import {strikeThrough} from "@/lib/constants";

type PageProps = {
  control: Control<any>;
  name: string;
};

function StrikeThrough({control, name}: PageProps) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={Array.from({length: strikeThrough.length}, () => true)}
      render={({field}) => (
        <Field>
          <FieldLabel className="mb-0">Doofes bitte durchstreichen</FieldLabel>
          <div className="flex gap-2 flex-wrap">
            {strikeThrough.map((label, i) => (
              <Button
                type="button"
                variant={
                  field.value && field.value[i] == true ? "default" : "outline"
                }
                key={i}
                onClick={() => {
                  if (field.value == undefined) return;
                  const newValue = [...field.value];
                  newValue[i] = !newValue[i];
                  field.onChange(newValue);
                }}
                className={`px-2 py-1 border rounded ${
                  field.value != undefined && !field.value[i]
                    ? "line-through"
                    : ""
                }`}
              >
                {label}
              </Button>
            ))}
          </div>
        </Field>
      )}
    />
  );
}

export default StrikeThrough;
