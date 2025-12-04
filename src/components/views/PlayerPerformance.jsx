import { useEffect, useState } from "react";
import "./chartSetup";
import { Line } from "react-chartjs-2";

export default function PlayerPerformance({ playerId, getPlayerProfile }) {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!playerId) {
      setPerformance(null);
      return;
    }
    setLoading(true);
    getPlayerProfile(playerId)
      .then((data) => {
        if (!mounted) return;
        setPerformance(data?.player?.seasons ?? null);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setError(err);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => (mounted = false);
  }, [playerId, getPlayerProfile]);

  const chartReady = Array.isArray(performance) && performance.length > 0;
  let chartData = { labels: [], datasets: [] };
  if (chartReady) {
    const seasons = performance
      .filter((s) => s && s.type === "REG")
      .sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

    const labels = seasons.map((s) => String(s.year ?? ""));

    const avgValues = seasons.map((s) => {
      const avg =
        s?.totals?.statistics?.hitting?.overall?.avg ??
        s?.totals?.statistics?.hitting?.avg ??
        null;
      return avg != null ? parseFloat(String(avg)) : null;
    });

    const slgValues = seasons.map((s) => {
      const slg =
        s?.totals?.statistics?.hitting?.overall?.slg ??
        s?.totals?.statistics?.hitting?.slg ??
        null;
      return slg != null ? parseFloat(String(slg)) : null;
    });

    chartData = {
      labels,
      datasets: [
        {
          label: "Batting Average",
          data: avgValues,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.15)",
          tension: 0.2,
          yAxisID: "y",
        },
        {
          label: "SLG",
          data: slgValues,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.15)",
          tension: 0.2,
          yAxisID: "y",
        },
      ],
    };
  }

  const options = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: false } },
  };

  return (
    <section className="view player-performance">
      <h3>Player Performance Over Years</h3>
      {loading && <p>Loading performance data...</p>}
      {error && <p>Error loading performance data.</p>}
      {!loading && !error && (
        <div>
          {!chartReady && <p>No performance data available for this player.</p>}
          {chartReady && (
            <>
              <Line data={chartData} options={options} />
            </>
          )}
        </div>
      )}
    </section>
  );
}
