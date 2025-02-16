import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../icons/Home_icon";
import SearchIcon from "../icons/Search_icon";
import CalendarIcon from "../icons/Calendar_icon";
import TimerIcon from "../icons/Timer_icon";
import NotesIcon from "../icons/Notes_icon";
import ProfileIcon from "../icons/Profile_icon";
import Groupicon from "../icons/Group_icon";
import Teardrop from "./Teardrop";
import { AuthContext } from "../context/authcontext";

function Navbar() {
  const iconRefs = useRef([]);

  const [activeIcon, setActiveIcon] = useState("home");
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const savedIcon = localStorage.getItem("activeIcon") || "home";
    setActiveIcon(savedIcon);

    // Find the icon's position
    const index = [
      "home",
      "search",
      "calendar",
      "timer",
      "notes",
      "groups",
      "profile",
    ].indexOf(savedIcon);

    if (iconRefs.current[index]) {
      const iconRect = iconRefs.current[index].getBoundingClientRect();
      setIconPosition({
        top: iconRect.top,
        left: iconRect.left,
      });
    }
  }, []);

  const [screenFormat, setScreenFormat] = useState(
    window.innerWidth >= 1024 ? "lg" : "md"
  );

  useEffect(() => {
    const handleResize = () => {
      const newFormat = window.innerWidth >= 1024 ? "lg" : "md";

      if (newFormat !== screenFormat) {
        setScreenFormat(newFormat); // Update format
      }

      // Wait a bit to let layout fully update
      setTimeout(() => {
        const index = [
          "home",
          "search",
          "calendar",
          "timer",
          "notes",
          "groups",
          "profile",
        ].indexOf(activeIcon);

        if (iconRefs.current[index]) {
          const iconRect = iconRefs.current[index].getBoundingClientRect();
          setIconPosition({
            top: iconRect.top,
            left: iconRect.left,
          });
        }
      }, 100); // Small delay ensures correct layout
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIcon, screenFormat]); // Recalculate when format chan

  const handleClick = (icon, path, index) => {
    setActiveIcon(icon);
    localStorage.setItem("activeIcon", icon);
    navigate(path);

    const iconElement = iconRefs.current[index];
    if (iconElement) {
      const iconRect = iconElement.getBoundingClientRect();
      setIconPosition({
        top: iconRect.top,
        left: iconRect.left,
      });
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full h-full bg-violet-700 flex flex-row  items-center lg:absolute lg:h-full lg:flex-col  lg:bottom-0 lg:left-0">
      <p className="relative text-white font-bold text-2xl lg:block lg:mb-12 lg:top-5 hidden">
        SELFIE
      </p>
      <div className=" w-full  lg:h-full lg:w-auto flex flex-row items-center justify-around lg:flex-col">
        {[
          {
            icon: "home",
            path: `/home/${currentUser._id}`,
            component: <HomeIcon />,
          },
          {
            icon: "search",
            path: `/search/${currentUser._id}`,
            component: <SearchIcon />,
          },
          {
            icon: "calendar",
            path: `/calendar/${currentUser._id}`,
            component: <CalendarIcon />,
          },
          {
            icon: "timer",
            path: `/timer/${currentUser._id}`,
            component: <TimerIcon />,
          },
          {
            icon: "notes",
            path: `/notes/${currentUser._id}`,
            component: <NotesIcon />,
          },
          {
            icon: "groups",
            path: `/notes/${currentUser._id}`,
            component: <Groupicon />,
          },
          {
            icon: "profile",
            path: `/profile/${currentUser._id}`,
            component: <ProfileIcon />,
          },
        ].map((item, index) => (
          <div
            key={item.icon}
            ref={(e) => (iconRefs.current[index] = e)}
            onClick={() => {
              handleClick(item.icon, item.path, index);
            }}
          >
            {item.component}
          </div>
        ))}
      </div>
      {activeIcon && (
        <Teardrop activeIcon={activeIcon} iconPosition={iconPosition} />
      )}
    </div>
  );
}

export default Navbar;
