import { fireEvent, render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Input from "./input";

describe("Input test", () => {
  test("Should render and register a change", () => {
    const onChange = vi.fn();

    const { getByTestId } = render(
      <Input
        data-testid="currency"
        id="currency"
        name="currency"
        onChange={onChange}
      />
    );

    const input = getByTestId("currency");

    expect(input).toBeInTheDocument();

    input.focus();
    fireEvent.change(input, { target: { value: "Wars" } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("Wars");
  });
});
