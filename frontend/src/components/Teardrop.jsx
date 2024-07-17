import React from "react";
import HomeIconglow from "../icons/Home_iconglow";
import SearchIconglow from "../icons/Search_iconglow";
import CalendarIconglow from "../icons/Calendar_iconglow";
import TimerIconglow from "../icons/Timer_iconglow";
import NotesIconglow from "../icons/Notes_iconglow";
import ProfileIconglow from "../icons/Profile_iconglow";

const iconPositions = {
  home: { top: "13%" },
  search: { top: "27%" },
  calendar: { top: "42%" },
  timer: { top: "55%" },
  notes: { top: "70%" },
  profile: { top: "85%" },
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
  const position = iconPositions[activeIcon] || { top: "0" };
  const baseTop = parseFloat(position.top); // Convert to a number for calculation
  const IconComponent = iconComponents[activeIcon]; // Get the active icon component

  return (
    <div className="fixed top-0 l-0 w-1/12 h-full flex pointer-events-none">
      <div
        className="absolute w-[113px] h-[114px] right-0 bg-[#313338] transition-all duration-1000 ease-in-out"
        style={{
          top: `${baseTop}%`,
          borderRadius: "50% 50% 50% 50% / 0% 0% 100% 100%",
          transform: "rotate(90deg)",
        }}
      ></div>
      <div
        className="absolute right-0 w-[90px] h-[150px] transition-all duration-1000 ease-in-out shadow-teardrop-shadow"
        style={{
          top: `${baseTop - 18.4}%`,
          borderRadius: "100% 0% 100% 0% / 0% 50% 50% 100% ",
        }}
      ></div>
      <div
        className="absolute right-0 w-[90px] h-[150px] transition-all duration-1000 ease-in-out shadow-teardrop-shadow"
        style={{
          top: `${baseTop + 13}%`,
          borderRadius: "100% 0% 100% 0% / 0% 50% 50% 100% ",
          transform: "rotateX(180deg)", // Corrected typo in rotation
        }}
      ></div>
      <div
        className="absolute ransition-all duration-1000 ease-in-out right-[50px] "
        style={{ top: `${baseTop + 6 }%` }}
      >
        {IconComponent && <IconComponent />}
      </div>
    </div>
  );
}

export default Teardrop;
