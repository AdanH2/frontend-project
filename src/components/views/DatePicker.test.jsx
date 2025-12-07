import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import DatePicker from "./DatePicker";

test("renders date input and calls onChange with slashed date", () => {
  const onChange = vi.fn();
  render(<DatePicker value="2025/12/07" onChange={onChange} />);

  const input = screen.getByLabelText(/Date:/i);
  expect(input).toBeInTheDocument();

  // The component converts YYYY/MM/DD -> YYYY-MM-DD for the native input
  expect(input.value).toBe("2025-12-07");

  // Simulate the user picking a new date in the native input
  fireEvent.change(input, { target: { value: "2025-12-08" } });
  expect(onChange).toHaveBeenCalledWith("2025/12/08");
});
