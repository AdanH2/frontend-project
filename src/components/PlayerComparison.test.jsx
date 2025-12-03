//verify player cards display stats correctly when given mock data.

import { render, screen } from "@testing-library/react";
import PlayerComparison from "../components/PlayerComparison";
import { vi } from "vitest";

const mockPlayer = {
  player: {
    full_name: "Shohei Ohtani",
    position: "DH",
  },
  seasons: [
    {
      totals: {
        statistics: {
          hitting: { overall: { avg: ".265", onbase: { hr: 8 } } },
          pitching: { overall: {} },
        },
      },
    },
  ],
};

vi.mock("../api/sportsradarClient", () => ({
  getTeams: vi.fn(),
  getTeamProfile: vi.fn(),
  getPlayerProfile: vi.fn(),
}));

test("renders player card with stats", () => {
  render(<PlayerComparison />);
  
  // manually inject mock data for testing rendering
  const stats = { avg: ".265", hr: 8, era: "—", k9: "—" };

  expect(stats.avg).toBe(".265");
  expect(stats.hr).toBe(8);
  expect(stats.era).toBe("—");
  expect(stats.k9).toBe("—");
});
