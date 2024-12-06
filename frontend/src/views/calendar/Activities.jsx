
import React, { useState } from "react";

const Activities = ({eventType, setEventType}) => {

  const [title, setTitle] = useState("");
  
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false); 
  const [unSelectedType, setUnSelectedType] = useState("event"); 

  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };


  const selectEventType = () => {
    setIsTypeSelectOpen(!isTypeSelectOpen);
  };

  const changeType = () => {
 
    setEventType(unSelectedType);
    setIsTypeSelectOpen(false);
  };

  return (
    <form className="flex flex-col gap-4 absolute w-full h-full px-8 top-[20%]">
      <div className="flex flex-row items-center w-full z-10">
        <input
          className="flex l-0 p-2 rounded-xl border text-white w-[65%] bg-[#4a484d] text-center border-none focus:outline-none"
          type="text" 
          name="Title"
          onChange={handleTitleChange}
          value={title}
          placeholder="Title"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="stroke-white"
          className={`size-6 stroke-white mt-1 ml-5 transition-transform duration-300 ${
            isTypeSelectOpen ? "rotate-90" : "rotate-0"
          }`}
          onClick={selectEventType}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="eventType text-white">
          {eventType || "No Event Type"}
        </span>
      </div>

      {isTypeSelectOpen && (
        <div className="absolute items-center right-9 flex flex-col bg-black z-2 rounded-2xl w-[27%] min-h-[17%]">
          <button
            className="flex absolute text-white ml-1 bottom-4"
            onClick={changeType}
          >
            {unSelectedType} 
          </button>
        </div>
      )}
    </form>
  );
};

export default Activities;
