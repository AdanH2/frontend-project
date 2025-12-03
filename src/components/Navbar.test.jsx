// verify links render correctly and the MLB logo appears.

import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import mlbLogo from "../assets/images/mlb-logo.png";

test("renders navbar links", () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Live Updates/i)).toBeInTheDocument();
  expect(screen.getByText(/Player Comparison/i)).toBeInTheDocument();
  expect(screen.getByText(/Team Overview/i)).toBeInTheDocument();
});

test("renders MLB logo", () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  const logo = screen.getByAltText(/MLB Logo/i);
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAttribute("src", mlbLogo);
});
