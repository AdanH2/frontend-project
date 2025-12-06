function formatToSlash(dateIso) {
  // input: YYYY-MM-DD -> output: YYYY/MM/DD
  if (!dateIso) return "";
  return dateIso.replace(/-/g, "/");
}

function isoFromSlash(slashed) {
  if (!slashed) return "";
  return slashed.replace(/\//g, "-");
}

export default function DatePicker({ value, onChange }) {
  // value is expected in YYYY/MM/DD. We'll convert to YYYY-MM-DD for the native input.
  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const defaultIso = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;

  const isoValue = value ? isoFromSlash(value) : defaultIso;

  function handleChange(e) {
    const iso = e.target.value;
    const slashed = formatToSlash(iso);
    onChange && onChange(slashed);
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <label>
        Date:
        <input
          type="date"
          value={isoValue}
          onChange={handleChange}
          style={{ marginLeft: 8 }}
        />
      </label>
    </div>
  );
}
