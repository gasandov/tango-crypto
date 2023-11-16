import { forwardRef, type ComponentProps } from "react";

interface Props {
  options: { id: string; symbol: string; partner_symbol: string }[];
}

const Dropdown = forwardRef<
  HTMLSelectElement,
  Props & ComponentProps<"select">
>(({ name, options, ...rest }, ref) => {
  return (
    <select name={name} ref={ref} {...rest}>
      <option defaultValue={""} disabled />
      {options.map((opt) => (
        <option key={`${name}-${opt.id}`} value={opt.symbol}>
          {opt.partner_symbol}
        </option>
      ))}
    </select>
  );
});

export default Dropdown;
