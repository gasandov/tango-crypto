import { ComponentProps, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ ...rest }, ref) => {
    return <input {...rest} ref={ref} />;
  }
);

export default Input;
