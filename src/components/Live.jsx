import { useState } from "react";
import GameCard from "./views/GameCard";
import DatePicker from "./views/DatePicker";

export default function Live() {
  // default to today in YYYY/MM/DD
  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const defaultDate = `${today.getFullYear()}/${pad(
    today.getMonth() + 1
  )}/${pad(today.getDate())}`;

  const [date, setDate] = useState(defaultDate);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2">Live Updates</h1>
      <DatePicker value={date} onChange={setDate} />
      {/* <GameCard date={"2024/08/28"} /> */}
      <GameCard date={date} />
    </div>
  );
}
