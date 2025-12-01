import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import PlayerComparison from "./components/PlayerComparison";
import TeamStats from "./components/TeamStats";
import Live from "./components/Live";



function App() {
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<PlayerComparison />} />
        <Route path="/teams" element={<TeamStats />} />
        <Route path="/live" element={<Live />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
