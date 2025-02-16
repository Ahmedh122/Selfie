import React, { useState, useEffect, useRef } from "react";
import HomeIconglow from "../icons/Home_iconglow";
import SearchIconglow from "../icons/Search_iconglow";
import CalendarIconglow from "../icons/Calendar_iconglow";
import TimerIconglow from "../icons/Timer_iconglow";
import NotesIconglow from "../icons/Notes_iconglow";
import ProfileIconglow from "../icons/Profile_iconglow";
import Groupiconglow from "../icons/Group_iconglow";
import waveimgver from "../assets/wavevertical.png";
import waveimgvhor from "../assets/wavehorizontal.png";

const iconComponents = {
  home: HomeIconglow,
  search: SearchIconglow,
  calendar: CalendarIconglow,
  timer: TimerIconglow,
  notes: NotesIconglow,
  groups: Groupiconglow,
  profile: ProfileIconglow,
};

function Teardrop({ activeIcon, iconPosition }) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const waveRef = useRef(null);

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

  const adjustedTop = waveRef.current
    ? iconPosition.top - waveRef.current.getBoundingClientRect().height /2
    : iconPosition.top;

  const adjustedLeft = waveRef.current
    ? iconPosition.left - waveRef.current.getBoundingClientRect().width / 2
    : iconPosition.left;

  return (
    <div className="absolute flex flex-row w-screen h-full lg:h-screen  lg:w-full pointer-events-none overflow-hidden select-none">
      <div
        ref={waveRef}
        className="absolute w-40 h-[90%] lg:w-[5.5rem] lg:h-20 lg:right-0 flex items-center justify-center  duration-1000 ease-in-out   "
        style={{
          top: isLargeScreen ? `${adjustedTop+12.5}px` : "auto",
          left: isLargeScreen ? "auto" : `${adjustedLeft+12}px`,
        }}
      >
     <img
          className="absolute  lg:top-auto lg:"
          src={isLargeScreen ? waveimgver : waveimgvhor}
          alt=""
        /> 
        <div className="relative top-[7%] lg:top-0 lg:right-[12%]">
          {IconComponent && <IconComponent />}
        </div>
      </div>

      
    </div>
  );
}

export default Teardrop;
