import { strikeThroughLabels } from "@/lib/constants";

import { Control, Controller } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { SetStateAction } from "react";

type PageProps = {
  control: Control<any>;
  name: string;
  setPreview: (value: SetStateAction<string | undefined>) => void;
  preview: string | undefined;
};

function UploadButton({ control, name, setPreview, preview }: PageProps) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={Array.from(
        { length: strikeThroughLabels.length },
        () => true,
      )}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Foto hochladen</FieldLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              field.onChange(file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result as string);
                reader.readAsDataURL(file);
              } else {
                setPreview(undefined);
              }
            }}
            onBlur={field.onBlur}
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
          <FieldDescription>Wähle ein Bild von dir aus.</FieldDescription>
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}

export default UploadButton;
