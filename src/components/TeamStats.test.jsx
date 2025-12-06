// src/components/TeamStats.test.jsx
import { render, screen } from "@testing-library/react";
import TeamStats from "../components/TeamStats";
import standingsData from "../data/standings.json";

test("renders heading with season", () => {
  render(<TeamStats />);
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toBeInTheDocument();
  expect(heading.textContent).toMatch(/MLB Team Overview/i);
});

test("renders team selector buttons", () => {
  render(<TeamStats />);
  const teamButtons = screen.getAllByRole("button");
  expect(teamButtons.length).toBeGreaterThanOrEqual(5);
  expect(teamButtons[0].textContent).toMatch(/MIL|CHC|CIN|TOR|NYY/);
});

test("renders TeamOverviewCard for initial selected team", () => {
  render(<TeamStats />);
  
  // Pick first selected team from standingsData
  const firstTeam = standingsData.league?.season?.leagues
    .flatMap(lg => lg.divisions?.flatMap(div => div.teams || []))
    .find(t => ["MIL","CHC","CIN","TOR","NYY"].includes(t.abbr));

  if (firstTeam) {
    // Multiple elements might contain market name (button + card)
    // We check for heading inside the card using the name (market + team)
    const cardHeading = screen.getAllByRole("heading", { level: 2 })
      .find(h => h.textContent.includes(firstTeam.market) && h.textContent.includes(firstTeam.name));
    expect(cardHeading).toBeInTheDocument();
  }
});

test("renders Home vs Away and Form charts", () => {
  render(<TeamStats />);

  const homeAwayChartHeading = screen.getByText(/Home vs. Away Win Percentage/i);
  const formChartHeading = screen.getByText(/Current Form vs. Overall Performance/i);

  expect(homeAwayChartHeading).toBeInTheDocument();
  expect(formChartHeading).toBeInTheDocument();
});
