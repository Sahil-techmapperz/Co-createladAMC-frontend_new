import React from "react";
import "./mobileNav.css"; // Ensure your CSS is set up to style these new elements
import { Link } from "react-router-dom";

const NavSidebar = ({ isOpen, toggleSidebar }) => {
  // Function to handle click events on links
  const handleLinkClick = () => {
    console.log("Link clicked!");
    // Add additional functionality as needed
  };

  return (
    <div className={isOpen ? "sidebar open" : "sidebar"}>
      <button onClick={toggleSidebar}>Close</button>
      <ul className="grid-cols-2 ml-[20%]">
        <li className="font-bold text-base md:text-lg"><Link to="/" onClick={handleLinkClick}>Home</Link></li>
        <li className="font-bold text-base md:text-lg"><Link to="/about" onClick={handleLinkClick}>About</Link></li>

        <li className="relative group">
          <span className="font-bold text-base md:text-lg cursor-pointer">
            Offering
          </span>
          <ul className="absolute hidden bg-white p-4 space-y-2 border rounded-md group-hover:block w-[40vw] left-0">
            <li className="text-base">
              <Link to="/mentor-connect" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-400">Mentor Connect</Link>
            </li>
            <li className="text-base">
              <Link to="/investor-connect" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-400">Investor Connect</Link>
            </li>
            <li className="text-base">
              <Link to="/grant-connect" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-400">Grant Connect</Link>
            </li>
          </ul>
        </li>
        <li className="font-bold text-base md:text-lg"><Link to="/services" onClick={handleLinkClick}>Services</Link></li>
        <li className="font-bold text-base md:text-lg"><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>

        <li> 
          <button className="border-2 font-bold border-black rounded-full w-[80px]">
            <Link to="/join" onClick={handleLinkClick}>Join Now</Link>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavSidebar;
