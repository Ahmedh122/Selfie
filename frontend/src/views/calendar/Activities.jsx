import React, { useEffect, useState } from "react";
import Searchbar from "../../components/Searchbar";

const Activities = ({ eventType, setEventType }) => {
  const [title, setTitle] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const currentDate = new Date();
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [unSelectedType, setUnSelectedType] = useState("event");
  const [endDate, setEndDate] = useState(currentDate);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [endHours, setEndHours] =useState("00");
  const [endMinutes, setEndMinutes] =useState("00");
  const [istime, setIstime] = useState(false);
  const [showsUsers, setShowsUsers] =useState(false);
  
  
  const handleTime = (e, type, offset1, offset2) => {
    e.preventDefault();

    if (type === "hoursEnd") {
      let hours = parseInt(endHours);
      hours = (hours + offset1 + 24) % 24;
      setEndHours(String(hours).padStart(2, "0"));
    } else if (type === "minutesEnd") {
      let minutes = parseInt(endMinutes);
      let hours = parseInt(endHours);

      minutes += offset2;

     
      if (minutes >= 60) {
        hours = (hours + Math.floor(minutes / 60)) % 24; 
        minutes = minutes % 60; 
      } else if (minutes < 0) {
        hours = (hours - 1 + 24) % 24; 
        minutes = (minutes + 60) % 60; 
      }

      setEndMinutes(String(minutes).padStart(2, "0"));
      setEndHours(String(hours).padStart(2, "0"));
    }
  };
  
  
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

  const handleUserSelect = (user) => {
   
    const userExists = selectedUsers.some(
      (selectedUser) => selectedUser._id === user._id
    );
    if (!userExists) {
     
      setSelectedUsers((prevUsers) => [...prevUsers, user]);
    } console.log("Selected users:", selectedUsers);
  };

  const handleunselectUser =(user) =>{
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((selectedUser) => selectedUser._id !== user._id)
    );
  }


  

  return (
    <form className="flex flex-col  absolute w-full h-full px-8 top-[20%]">
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

      <div
        className={`flex items-center justify-between  bg-[#1B1B1F] h-11 py-8 px-3  mt-2  ${
          istime ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <span className=" text-white font-bold">end</span>
        <input
          type="date"
          id="start"
          value={endDate}
          min="1900-01-01"
          max="2038-12-31"
          className="  p-2 rounded-md w-[50%] h-[2.5rem] border text-white  bg-[#4a484d] border-none focus:outline-none mr-1 "
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="text-white text-lg flex justify-center items-center p-2 rounded-md w-[30%] h-[2.5rem] border   bg-[#4a484d] border-none focus:outline-none mr-1 "
          onClick={(e) => {
            e.preventDefault();
            setIstime(!istime);
          }}
        >
          {endHours}:{endMinutes}
        </button>
      </div>
      {istime && (
        <>
          <div className="bg-[#1B1B1F] h-36 w-full  rounded-b-xl flex flex-row items-center justify-around px-28 ">
            <div className="flex flex-col items-center justify-center gap-2">
              <button
                className="flex w-7 h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl  "
                onClick={(e) => handleTime(e, "hoursEnd", 1, 0)}
              >
                +
              </button>
              <input
                className="bg-[#4a484d] text-center w-7 text-white  border-none focus:outline-none rounded-lg "
                type="text"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d{0,2}$/.test(value)) {
                    setEndHours(value);
                  }
                }}
                value={endHours}
                onBlur={() => {
                  setEndHours(String(endHours).padStart(2, "0"));
                }}
              />
              <button
                className="flex w-7 h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl  "
                onClick={(e) => handleTime(e, "hoursEnd", -1, 0)}
              >
                -
              </button>
            </div>
            <span className="text-white font-bold text-xl">:</span>
            <div className="flex flex-col items-center justify-center gap-2">
              <button
                className="flex w-7 h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl  "
                onClick={(e) => handleTime(e, "minutesEnd", 0, 5)}
              >
                +
              </button>
              <input
                className="bg-[#4a484d] text-center w-7 text-white  border-none focus:outline-none rounded-lg "
                type="text"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d{0,2}$/.test(value)) {
                    setEndMinutes(value);
                  }
                }}
                value={endMinutes}
                onBlur={() => {
                  setEndMinutes(String(endMinutes).padStart(2, "0"));
                }}
              />
              <button
                className="flex w-7 h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl "
                onClick={(e) => handleTime(e, "minutesEnd", 0, 5)}
              >
                -
              </button>
            </div>
          </div>
        </>
      )}
      <div
        className={`flex items-center justify-between mt-2 bg-[#1B1B1F] h-16 p-4  ${
          isSearch || (selectedUsers.length > 0 && showsUsers)
            ? "rounded-t-xl"
            : "rounded-xl"
        }`}
      >
        <span className="text-white font-bold">Invite friends</span>
        <div className="flex flex-row gap-2 text-white font-bold">
          <button
            className={`bg-[#4a484d] min-w-10 p-2 rounded-xl ${
              selectedUsers.length > 0 && showsUsers
                ? "bg-[#2f2f30]"
                : "bg-[#4a484d]"
            } `}
            onClick={(e) => {
              e.preventDefault();
              setShowsUsers(!showsUsers);
            }}
          >
            {selectedUsers.length}
          </button>
          <button
            className="bg-none text-white w-auto h-auto text-xl flex justify-center items-center"
            onClick={(e) => {
              e.preventDefault();
              setIsSearch(!isSearch);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </button>
        </div>
      </div>
      {selectedUsers.length > 0 && showsUsers && (
        <>
          <div
            className={`w-full  bg-[#1B1B1F] pb-3  ${
              isSearch ? "" : "rounded-b-xl"
            }`}
          >
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className="bg-[#1B1B1F] flex flex-row  p-3 px-4 justify-between item-center"
              >
                <div className="flex flex-row gap-2">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      user && user.profilePic
                        ? `http://localhost:8800${user.profilePic}`
                        : "https://cdn-icons-png.flaticon.com/512/10542/10542486.png"
                    }
                    alt=""
                  />
                  <span className="text-white font-bold">{user.name}</span>
                  <span className="text-white font-bold">{user.surname}</span>
                </div>
                <button
                  className=""
                  onClick={(e) => {
                    e.preventDefault();
                    handleunselectUser(user);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 stroke-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex h-10 w-full  ">
        {isSearch && <Searchbar handleUserSelect={handleUserSelect} />}
      </div>
    </form>
  );
};

export default Activities;
