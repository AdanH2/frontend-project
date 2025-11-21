export default function TeamPerformance({ teamId, season }) {
  return (
    <section className="view team-performance">
      <h3>Team Performance Over Years {season ? `— ${season}` : ""}</h3>
      {!teamId && <p>No team selected.</p>}
      {teamId && (
        <div>
          <p>
            Team season-by-season performance/charts would appear here for team{" "}
            {teamId}.
          </p>
          {/* Implement calls to fetch results and standings for the selected
            season. */}
        </div>
      )}
    </section>
  );
}
