import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../icons/Home_icon";
import SearchIcon from "../icons/Search_icon";
import CalendarIcon from "../icons/Calendar_icon";
import TimerIcon from "../icons/Timer_icon";
import NotesIcon from "../icons/Notes_icon";
import ProfileIcon from "../icons/Profile_icon";
import Teardrop from "./Teardrop"; 
import { AuthContext } from "../context/authcontext";
import { useQueryClient } from "react-query";

function Navbar() {
   
    const queryClient = useQueryClient();
  const [activeIcon, setActiveIcon] = useState("home"); 
  const navigate = useNavigate(); 
  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    
    const savedIcon = localStorage.getItem("activeIcon");
    if (savedIcon) {
      setActiveIcon(savedIcon);
    }
    
  }, []);

  useEffect (()=> {
    console.log(currentUser)
  },[currentUser]);

  const handleClick = (icon, path) => {
    setActiveIcon(icon);
    localStorage.setItem("activeIcon", icon); 
    navigate(path); 
  };

  return (
    <div className="relative bottom-0 left-0 w-full h-full bg-violet-700 flex flex-row justify-around items-center lg:relative lg:h-screen lg:flex-col  lg:bottom-auto lg:left-auto">
      <p className="text-white font-bold text-2xl lg:block hidden">SELFIE</p>
      <div
        onClick={() => handleClick("home", `/home/${currentUser._id}`)}
        className={`p-2 cursor-pointer ${
          activeIcon === "home" ? "active" : ""
        }`}
      >
        <HomeIcon />
      </div>
      <div
        onClick={() => handleClick("search", `/search/${currentUser._id}`)}
        className={`p-2 cursor-pointer ${
          activeIcon === "search" ? "active" : ""
        }`}
      >
        <SearchIcon />
      </div>
      <div
        onClick={() => handleClick("calendar", `/calendar/${currentUser._id}`)}
        className={`p-2 cursor-pointer ${
          activeIcon === "calendar" ? "active" : ""
        }`}
      >
        <CalendarIcon />
      </div>
      <div
        onClick={() => handleClick("timer", `/timer/${currentUser._id}`)}
        className={`p-2 cursor-pointer ${
          activeIcon === "timer" ? "active" : ""
        }`}
      >
        <TimerIcon />
      </div>
      <div
        onClick={() => handleClick("notes", `/notes/${currentUser._id}`)}
        className={`p-2 cursor-pointer ${
          activeIcon === "notes" ? "active" : ""
        }`}
      >
        <NotesIcon />
      </div>
      <div
        onClick={() => {handleClick("profile", `/profile/${currentUser._id}`);}}
        className={`p-2 cursor-pointer ${
          activeIcon === "profile" ? "active" : ""
        }`}
      >
        <ProfileIcon />
      </div>
      {activeIcon && <Teardrop activeIcon={activeIcon} />}
    </div>
  );
}

export default Navbar;
