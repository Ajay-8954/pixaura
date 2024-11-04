import { Heart } from "lucide-react";
import logo from "../images/pixAura_logo.png";
import "../App.css";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-2 bg-white shadow-md fixed top-0 left-0 w-full z-10">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10" />{" "}
        {/* Adjust the height as needed */}
      </div>

      {/* Right side: Heart Icon */}
      <div className="flex items-center">
      <Heart
          className="h-6 w-6 text-pink-500 transition-colors duration-3000 ease-in-out" // Regular styling
          style={{ 
            fill: "purple", 
            animation : "pulse 1s infinite"   // Add the custom pulse animation
          }} 
        />
      </div>
    </header>
  );
};

export default Header;
