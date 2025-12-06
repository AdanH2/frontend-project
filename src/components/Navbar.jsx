import { NavLink } from "react-router-dom";
import mlbLogo from "../assets/images/mlb-logo.png";
//const mlbLogo = "https://placehold.co/100x64/002D72/FFFFFF?text=MLB+Logo";


// generate dynamic Tailwind classes for NavLink
const getNavLinkClasses = (isActive) => {
    // Base classes for all links
    const baseClasses = "px-4 py-2 rounded-lg font-bold text-gray-800 transition duration-150 ease-in-out whitespace-nowrap";
    
    // Classes that change based on the active state
    const activeClasses = isActive 
        ? "bg-white border-b-2 border-blue-500 shadow-md" // Active: White background, blue border, subtle shadow
        : "bg-gray-100 hover:bg-gray-200 border-b-2 border-transparent"; // Inactive: Light gray background, hover effect
    
    return `${baseClasses} ${activeClasses}`;
};

export default function Navbar() {
  return (
    // Tailwind classes: sticky, white background, bottom border, responsive padding
    <nav className="w-full bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
        
        {/* Container for content, centered on wide screens */}
        <div className="max-w-7xl mx-auto p-4 md:px-6">
            
            {/* Top-left title */}
            {/* Replaced inline styles with text-black, font-extrabold, text-2xl, and mb-3 (12px) */}
            <h2 className="font-extrabold mb-3 text-gray-900 text-2xl text-left">
                MLB Stats Dashboard
            </h2>

            {/* Horizontal links + MLB logo container */}
            {/* Using flex for layout, space-between, and items-end (alignItems: 'flex-end') */}
            <div className="flex justify-between items-end">
                
                {/* Nav links container */}
                {/* Using flex and space-x-3 (12px gap) */}
                <div className="flex space-x-3 overflow-x-auto pb-1">
                    <NavLink
                        to="/"
                        end
                        // Use the new utility function to apply Tailwind classes dynamically
                        className={({ isActive }) => getNavLinkClasses(isActive)}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/live"
                        className={({ isActive }) => getNavLinkClasses(isActive)}
                    >
                        Live Updates
                    </NavLink>

                    <NavLink
                        to="/players"
                        className={({ isActive }) => getNavLinkClasses(isActive)}
                    >
                        Player Comparison
                    </NavLink>

                    <NavLink
                        to="/teams"
                        className={({ isActive }) => getNavLinkClasses(isActive)}
                    >
                        Team Overview
                    </NavLink>
                </div>

                {/* MLB Logo */}
                <div>
                    {/* Set logo height using Tailwind utility class. Added onError to handle placeholder failures gracefully. */}
                    <img
                        src={mlbLogo}
                        alt="MLB Logo"
                        className="h-16 w-auto"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x64/CCCCCC/333333?text=Logo"; }}
                    />
                </div>
            </div>
        </div>
    </nav>
  );
}