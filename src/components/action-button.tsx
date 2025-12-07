"use client";
import {ReactNode, useState} from "react";
import {Button, buttonVariants} from "./ui/button";
import {VariantProps} from "class-variance-authority";

type PageProps = {
  id: number;
  uploadURL: string;
  action: any;
  className?: string;
  children?: ReactNode | ReactNode[];
  variant?: ButtonVariant;
};

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

function ActionButton(props: PageProps) {
  const {action, id, uploadURL, children, className, variant} = props;
  const [disabled, setDisabled] = useState(false);
  async function handle() {
    try {
      setDisabled(true);
      await action(id, uploadURL);
      setDisabled(false);
    } catch (error) {
      console.log(error);
      setDisabled(false);
    }
  }
  return (
    <Button
      variant={variant ?? "default"}
      className={className ?? ""}
      disabled={disabled}
      onClick={handle}
    >
      {children}
    </Button>
  );
}

export default ActionButton;
