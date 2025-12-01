export default function PlayerPerformance({ playerId }) {
  // Placeholder: in a full implementation, fetch year-by-year performance
  return (
    <section className="view player-performance">
      <h3>Player Performance Over Years</h3>
      {!playerId && <p>No player selected.</p>}
      {playerId && (
        <div>
          <p>Year-by-year charts would appear here for player {playerId}.</p>
          {/* Implement API calls to fetch season-by-season stats. */}
        </div>
      )}
    </section>
  );
}
