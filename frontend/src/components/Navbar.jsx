import React, { useState } from "react";
import HomeIcon from "../icons/Home_icon";
import SearchIcon from "../icons/Search_icon";
import CalendarIcon from "../icons/Calendar_icon";
import TimerIcon from "../icons/Timer_icon";
import NotesIcon from "../icons/Notes_icon";
import ProfileIcon from "../icons/Profile_icon";
import Teardrop from "./Teardrop"; // Assuming Teardrop is in the same directory

function Navbar() {
  const [activeIcon, setActiveIcon] = useState(null);

  const handleClick = (icon) => {
    setActiveIcon(icon);
    console.log(icon);
  };

  return (
    <div className="relative h-screen bg-violet-700 flex flex-col justify-around items-center w-1/12">
      <p className="text-white font-bold text-2xl">SELFIE</p>
      <div onClick={() => handleClick("home")}>
        <HomeIcon />
      </div>
      <div onClick={() => handleClick("search")}>
        <SearchIcon />
      </div>
      <div onClick={() => handleClick("calendar")}>
        <CalendarIcon />
      </div>
      <div onClick={() => handleClick("timer")}>
        <TimerIcon />
      </div>
      <div onClick={() => handleClick("notes")}>
        <NotesIcon />
      </div>
      <div onClick={() => handleClick("profile")}>
        <ProfileIcon />
      </div>
      {activeIcon && <Teardrop activeIcon={activeIcon} />}
    </div>
  );
}

export default Navbar;
