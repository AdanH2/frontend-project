import { useEffect, useState } from "react";
import "../views/chartSetup";
import { Bar } from "react-chartjs-2";
import { getPlayerLabel } from "./labelHelpers";

export default function ERALeaders({ season = "2025", getSeasonLeaders }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getSeasonLeaders("era", season)
      .then((data) => {
        if (!mounted) return;
        const list = data.leaders;
        setLeaders(Array.isArray(list) ? list : []);
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
  }, [season, getSeasonLeaders]);

  // For ERA a lower value is better; show top N as returned by API
  const top = leaders.slice(0, 10);
  const labels = top.map((p) => getPlayerLabel(p));
  const values = top.map((p) => Number(p.value ?? p.era ?? 0));

  const data = {
    labels,
    datasets: [
      {
        label: "ERA",
        data: values,
        backgroundColor: "rgba(255,159,64,0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <section className="view era-leaders">
      <h3>ERA Leaders — {season}</h3>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading ERA leaders.</p>}
      {!loading && !error && (
        <div>
          {top.length === 0 && <p>No data available.</p>}
          {top.length > 0 && <Bar data={data} options={options} />}
        </div>
      )}
    </section>
  );
}
