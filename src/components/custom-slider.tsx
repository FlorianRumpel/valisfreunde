import { defaultSliderValue, strikeThroughLabels } from "@/lib/constants";
import { displayEmoji } from "@/lib/utils";

import { Control, Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";

type PageProps = {
  control: Control<any>;
  name: string;
};

function CustomSlider({ control, name }: PageProps) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={Array.from(
        { length: strikeThroughLabels.length },
        () => true,
      )}
      render={({ field, fieldState }) => (
        <Field
          className={!field.value?.enabled ? "opacity-50 " : ""}
          data-invalid={fieldState.invalid}
        >
          <FieldLabel>Wie gut bist du heute drauf von 1 bis 10?</FieldLabel>
          <div className="flex justify-between mb-2">
            <span>{displayEmoji(field.value?.value, field.name)}</span>
          </div>
          <Slider
            max={10}
            step={1}
            min={1}
            disabled={!field.value?.enabled}
            value={
              field.value?.value === undefined
                ? [defaultSliderValue]
                : [field.value.value]
            }
            onValueChange={(v) => {
              field.onChange({ ...field.value, value: v[0] });
            }}
          ></Slider>
          <div className="w-auto flex items-center gap-2 ">
            <FieldLabel htmlFor="funny">Aktivieren:</FieldLabel>
            <Checkbox
              className="mt-0.5"
              id="funny"
              checked={field.value?.enabled}
              onCheckedChange={(v) => {
                field.onChange({ ...field.value, enabled: v });
              }}
            />
          </div>
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}

export default CustomSlider;
