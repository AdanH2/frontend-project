import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Modal from "./Modal";

const mockGame = {
  game: {
    home: {
      abbr: "NYM",
      name: "Mets",
      runs: 3,
      starting_pitcher: {
        full_name: "Jacob deGrom",
        jersey_number: 48,
        win: 10,
        loss: 5,
        era: 2.87,
      },
    },
    away: {
      abbr: "LAD",
      name: "Dodgers",
      runs: 2,
      starting_pitcher: {
        full_name: "Clayton Kershaw",
        jersey_number: 22,
        win: 8,
        loss: 4,
        era: 3.45,
      },
    },
    status: "Live",
    venue: { name: "Citi Field" },
    weather: {
      forecast: {
        condition: "Sunny",
        temp_f: 75,
        cloud_cover: 10,
        humidity: 40,
        wind: { speed_mph: 5, direction: "NW" },
      },
      current_conditions: {
        condition: "Clear",
        temp_f: 74,
        cloud_cover: 12,
        humidity: 42,
        wind: { speed_mph: 6, direction: "NW" },
      },
    },
  },
};

test("renders modal details and triggers close", () => {
  const onClose = vi.fn();
  render(<Modal game={mockGame} onClose={onClose} />);

  // Title should show away @ home (abbr preferred)
  expect(screen.getByText(/LAD @ NYM/)).toBeInTheDocument();

  // Status and venue should be present
  expect(screen.getByText(/Status:/)).toBeInTheDocument();
  expect(screen.getByText(/Citi Field/)).toBeInTheDocument();

  // Close button should call onClose
  const btn = screen.getByLabelText(/Close/i);
  fireEvent.click(btn);
  expect(onClose).toHaveBeenCalled();
});
