import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../icons/Home_icon";
import SearchIcon from "../icons/Search_icon";
import CalendarIcon from "../icons/Calendar_icon";
import TimerIcon from "../icons/Timer_icon";
import NotesIcon from "../icons/Notes_icon";
import ProfileIcon from "../icons/Profile_icon";
import Teardrop from "./Teardrop"; // Assuming Teardrop is in the same directory

function Navbar() {
  const [activeIcon, setActiveIcon] = useState("home"); // Set default active icon to "home"
  const navigate = useNavigate(); // Initialize navigate

  const handleClick = (icon, path) => {
    setActiveIcon(icon);
    console.log(icon);
    navigate(path); // Use navigate to change the path
  };

  return (
    <div className="relative h-screen bg-violet-700 flex flex-col justify-around items-center w-1/12">
      <p className="text-white font-bold text-2xl">SELFIE</p>
      <div onClick={() => handleClick("home", "/")}>
        <HomeIcon />
      </div>
      <div onClick={() => handleClick("search", "/search")}>
        <SearchIcon />
      </div>
      <div onClick={() => handleClick("calendar", "/calendar")}>
        <CalendarIcon />
      </div>
      <div onClick={() => handleClick("timer", "/timer")}>
        <TimerIcon />
      </div>
      <div onClick={() => handleClick("notes", "/notes")}>
        <NotesIcon />
      </div>
      <div onClick={() => handleClick("profile", "/profile")}>
        <ProfileIcon />
      </div>
      {activeIcon && <Teardrop activeIcon={activeIcon} />}
    </div>
  );
}

export default Navbar;
