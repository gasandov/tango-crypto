import Dropdown from "components/atoms/dropdown";
import Input from "components/atoms/input";
import { ComponentProps } from "react";

interface InputGroupsProps {
  input: ComponentProps<typeof Input>;
  isCurrency?: boolean;
  label: string;
  select: ComponentProps<typeof Dropdown>;
}

const InputGroups = ({
  input,
  isCurrency,
  label,
  select,
}: InputGroupsProps) => {
  return (
    <div>
      <label
        htmlFor={input.name}
        className="block text-sm font-medium leading-6 text-white"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        {isCurrency && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
        )}
        <Input {...input} />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <label htmlFor={select.name} className="sr-only">
            {label}
          </label>
          <Dropdown {...select} />
        </div>
      </div>
    </div>
  );
};

export default InputGroups;
