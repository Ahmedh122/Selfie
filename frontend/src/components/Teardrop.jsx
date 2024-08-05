import React, { useState, useEffect } from "react";
import HomeIconglow from "../icons/Home_iconglow";
import SearchIconglow from "../icons/Search_iconglow";
import CalendarIconglow from "../icons/Calendar_iconglow";
import TimerIconglow from "../icons/Timer_iconglow";
import NotesIconglow from "../icons/Notes_iconglow";
import ProfileIconglow from "../icons/Profile_iconglow";
import waveimgver from "../assets/wavevertical.png";
import waveimgvhor from "../assets/wavehorizontal.png";

const iconPositionsVer = {
  home: { top: "11.5%" },
  search: { top: "26%" },
  calendar: { top: "40%" },
  timer: { top: "55%" },
  notes: { top: "69%" },
  profile: { top: "84%" },
};

const iconPositionsHor = {
  home: { left: "-2%" },
  search: { left: "15%" },
  calendar: { left: "31%" },
  timer: { left: "48%" },
  notes: { left: "64%" },
  profile: { left: "81%" },
};

const iconComponents = {
  home: HomeIconglow,
  search: SearchIconglow,
  calendar: CalendarIconglow,
  timer: TimerIconglow,
  notes: NotesIconglow,
  profile: ProfileIconglow,
};

function Teardrop({ activeIcon }) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const IconComponent = iconComponents[activeIcon];
  const position = isLargeScreen
    ? iconPositionsVer[activeIcon] || { top: "0" }
    : iconPositionsHor[activeIcon] || { left: "0" };

  const positionValue = isLargeScreen
    ? { top: `${parseFloat(position.top) - 3.5}%` }
    : { left: `${parseFloat(position.left) -4.5}%` };

  return (
    <div className="absolute flex flex-row w-screen h-full  lg:h-screen lg:flex-col lg:w-full pointer-events-none overflow-hidden select-none">
      <div
        className="absolute w-[30%] h-[90%]  lg:w-[80%] lg:h-[25%] lg:right-0 lg:left-auto lg:rotate-0 duration-1000 ease-in-out   "
        style={positionValue}
      >
        <img
          className="absolute h-full w-full lg:top-auto lg:left-auto"
          src={isLargeScreen ? waveimgver : waveimgvhor}
          alt=""
        />
      </div>

      <div
        className="absolute duration-1000 ease-in-out top-[30%] lg:right-[36%]"
        style={
          isLargeScreen
            ? { top: `${parseFloat(position.top) + 7}%` }
            : { left: `${parseFloat(position.left) + 7}%` }
        }
      >
        {IconComponent && <IconComponent />}
      </div>
    </div>
  );
}

export default Teardrop;
