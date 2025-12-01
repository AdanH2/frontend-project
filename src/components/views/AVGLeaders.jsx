import { useEffect, useState } from "react";
import "../views/chartSetup";
import { Bar } from "react-chartjs-2";
import { getPlayerLabel } from "./labelHelpers";

export default function AVGLeaders({ season = "2025", getSeasonLeaders }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getSeasonLeaders("batting_average", season)
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

  const top = leaders.slice(0, 10);
  const labels = top.map((p) => getPlayerLabel(p));
  const values = top.map((p) => Number(p.value ?? p.avg ?? 0));

  const data = {
    labels,
    datasets: [
      {
        label: "Batting Average",
        data: values,
        backgroundColor: "rgba(153,102,255,0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: false } },
  };

  return (
    <section className="view avg-leaders">
      <h3>Batting Average Leaders — {season}</h3>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading AVG leaders.</p>}
      {!loading && !error && (
        <div>
          {top.length === 0 && <p>No data available.</p>}
          {top.length > 0 && <Bar data={data} options={options} />}
          {/* <ul>
            {top.map((p, idx) => (
              <li key={p.id ?? idx}>
                {labels[idx]} — {values[idx]}
              </li>
            ))}
          </ul> */}
        </div>
      )}
    </section>
  );
}
