import { NavLink } from "react-router-dom";
import mlbLogo from "../assets/images/mlb-logo.png";

export default function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "white",
        padding: "16px 24px",
        borderBottom: "1px solid #ddd",
        boxSizing: "border-box",
      }}
    >
      {/* Top-left title */}
      <h2
        style={{
          fontWeight: "bold",
          margin: 0,
          marginBottom: "12px",
          color: "black",
          textAlign: "left",
        }}
      >
        MLB Stats Dashboard
      </h2>

      {/* Horizontal links + MLB logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end", 
        }}
      >
        {/* Nav links */}
        <div style={{ display: "flex", gap: "10px" }}>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: "bold",
              textDecoration: "none",
              color: "black",
              backgroundColor: isActive ? "white" : "#e6e6e6",
              border: isActive ? "1px solid #ccc" : "1px solid transparent",
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/live"
            style={({ isActive }) => ({
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: "bold",
              textDecoration: "none",
              color: "black",
              backgroundColor: isActive ? "white" : "#e6e6e6",
              border: isActive ? "1px solid #ccc" : "1px solid transparent",
            })}
          >
            Live Updates
          </NavLink>

          <NavLink
            to="/players"
            style={({ isActive }) => ({
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: "bold",
              textDecoration: "none",
              color: "black",
              backgroundColor: isActive ? "white" : "#e6e6e6",
              border: isActive ? "1px solid #ccc" : "1px solid transparent",
            })}
          >
            Player Comparison
          </NavLink>

          <NavLink
            to="/teams"
            style={({ isActive }) => ({
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: "bold",
              textDecoration: "none",
              color: "black",
              backgroundColor: isActive ? "white" : "#e6e6e6",
              border: isActive ? "1px solid #ccc" : "1px solid transparent",
            })}
          >
            Team Overview
          </NavLink>
        </div>

        {/* MLB Logo */}
        <div>
          <img
            src={mlbLogo}
            alt="MLB Logo"
            style={{ height: "65px" }} 
          />
        </div>
      </div>
    </nav>
  );
}
