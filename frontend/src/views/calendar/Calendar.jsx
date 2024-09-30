import React, { useState, useEffect } from "react";

function Calendar() {
  const daysOfWeekFull = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsOfYearShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentDate = new Date();
  const [displayMonth, setDisplayMonth] = useState(currentDate.getMonth());
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isPopupEventOpen, setPopupEventOpen] = useState(false);
  const [isPopupEventvisible, setPopupEventVisible] = useState(false);
  const [isStartEventDateopen, setStartEventDateopen] = useState(false);
  const [isStartEventTimeopen, setStartEventTimeopen] = useState(false);
  const [isEndEventDateopen, setEndEventDateopen] = useState(false);
  const [isEndEventTimeopen, setEndEventTimeopen] = useState(false);
  const [displayMonthEventStart, setDisplayMonthEventStart] = useState(
    currentDate.getMonth()
  );
  const [displayYearEventStart, setDisplayYearEventStart] = useState(
    currentDate.getFullYear()
  );
  const [selectedDateEventStart, setSelectedDateEventStart] =
    useState(null);
    const [displayMonthEventEnd, setDisplayMonthEventEnd] = useState(
      currentDate.getMonth()
    );
    const [displayYearEventEnd, setDisplayYearEventEnd] = useState(
      currentDate.getFullYear()
    );
    const [selectedDateEventEnd, setSelectedDateEventEnd] = useState(null);
  const [isEventDateStartManuallySet, setIsEventDateStartManuallySet] = useState(false);
  const [isEventDateEndManuallySet, setIsEventDateEndManuallySet] =
    useState(false);

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const daysInMonthEventDateStart = new Date(
    displayYearEventStart,
    displayMonthEventStart + 1,
    0
  ).getDate();


   const daysInMonthEventDateEnd = new Date(
     displayYearEventEnd,
     displayMonthEventEnd + 1,
     0
   ).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
  const firstDayOfMonthEventDateStart = new Date(
    displayYearEventStart,
    displayMonthEventStart,
    1
  ).getDay();

    const firstDayOfMonthEventDateEnd = new Date(
      displayYearEventEnd,
      displayMonthEventEnd,
      1
    ).getDay();

  const changeMonth = (offset) => {
    setDisplayMonth((prevMonth) => {
      const newMonth = prevMonth + offset;
      if (newMonth < 0) {
        setDisplayYear(displayYear - 1);
        return 11;
      } else if (newMonth > 11) {
        setDisplayYear(displayYear + 1);
        return 0;
      } else {
        return newMonth;
      }
    });
  };

  const changeMonthStartEvent = (offset, e) => {
    e.preventDefault();
    setDisplayMonthEventStart((prevMonth) => {
      const newMonth = prevMonth + offset;
      if (newMonth < 0) {
        setDisplayYearEventStart(displayYearEventStart - 1);
        return 11;
      } else if (newMonth > 11) {
        setDisplayYearEventStart(displayYearEventStart + 1);
        return 0;
      } else {
        return newMonth;
      }
    });
  };


    const changeMonthEndEvent = (offset, e) => {
      e.preventDefault();
      setDisplayMonthEventEnd((prevMonth) => {
        const newMonth = prevMonth + offset;
        if (newMonth < 0) {
          setDisplayYearEventEnd(displayYearEventEnd - 1);
          return 11;
        } else if (newMonth > 11) {
          setDisplayYearEventEnd(displayYearEventEnd + 1);
          return 0;
        } else {
          return newMonth;
        }
      });
    };

  const resetCalendar = () => {
    setDisplayMonth(currentDate.getMonth());
    setDisplayYear(currentDate.getFullYear());
    setSelectedDate(null);
  };

  const isToday = (day) => {
    return (
      day === currentDate.getDate() &&
      currentDate.getMonth() === displayMonth &&
      currentDate.getFullYear() === displayYear
    );
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(displayYear, displayMonth, day));
    setDisplayMonthEventStart(displayMonth);
    setDisplayYearEventStart(displayYear);
  };

useEffect(() => {
  if (!isEventDateStartManuallySet) {
    if (selectedDate) {
      setSelectedDateEventStart(selectedDate);
    } else {
      setSelectedDateEventStart(currentDate);
    }
  }
}, [selectedDate, currentDate, isEventDateStartManuallySet]);

const handleDateClickEventStart = (day) => {
  setSelectedDateEventStart(
    new Date(displayYearEventStart, displayMonthEventStart, day)
  );
  setIsEventDateStartManuallySet(true);
};


useEffect(() => {
  if (!isEventDateEndManuallySet) {
    if (selectedDate) {
      setSelectedDateEventEnd(selectedDate);
    } else {
      setSelectedDateEventEnd(currentDate);
    }
  }
}, [selectedDate, currentDate, isEventDateEndManuallySet]);

const handleDateClickEventEnd = (day) => {
  setSelectedDateEventEnd(
    new Date(displayYearEventEnd, displayMonthEventEnd, day)
  );
  setIsEventDateEndManuallySet(true);
};

const resetEventDate = () => {
  setIsEventDateStartManuallySet(false);
  setIsEventDateEndManuallySet(false); 
};

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  const togglePopupEvent = () => {
    setPopupEventOpen(!isPopupEventOpen);
    resetEventDate();
  };

  const toggleStartEventDate = (e) => {
    e.preventDefault();
    setStartEventDateopen(!isStartEventDateopen);
  };

  const toggleEndEventDate = (e) => {
    e.preventDefault();
    setEndEventDateopen(!isEndEventDateopen);
  };

  const toggleStartEventTime = (e) => {
    e.preventDefault();
    setStartEventTimeopen(!isStartEventTimeopen);
  };

   const toggleEndEventTime = (e) => {
     e.preventDefault();
     setEndEventTimeopen(!isEndEventTimeopen);
   };

  useEffect(() => {
    if (isPopupOpen) {
      setPopupVisible(true);
    } else {
      const timer = setTimeout(() => setPopupVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen]);

  useEffect(() => {
    if (isPopupEventOpen) {
      setPopupEventVisible(true);
    } else {
      const timer = setTimeout(() => setPopupEventVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isPopupEventOpen]);

  const displayDay = selectedDate
    ? daysOfWeekFull[selectedDate.getDay()]
    : daysOfWeekFull[currentDate.getDay()];

  const [dayInput, setDayInput] = useState(currentDate.getDate());
  const [monthInput, setMonthInput] = useState(currentDate.getMonth());
  const [yearInput, setYearInput] = useState(currentDate.getFullYear());

  const SubmitDate = (day, month, year) => {
    const validDay = parseInt(day, 10);
    const validMonth = parseInt(month, 10);
    const validYear = parseInt(year, 10);

    const newDate = new Date(validYear, validMonth, validDay);
    setSelectedDate(newDate);
    setDisplayMonth(validMonth);
    setDisplayYear(validYear);
    setPopupOpen(false);
  };

  const SubmitEvent = () => {
    /*post event to backend; */
  };

  const returnToSelection = () => {
    if (selectedDate) {
      setDisplayMonth(selectedDate.getMonth());
      setDisplayYear(selectedDate.getFullYear());
    } else {
      setDisplayMonth(currentDate.getMonth());
      setDisplayYear(currentDate.getFullYear());
      setSelectedDate(currentDate);
    }
  };

  return (
    <div className="calendar-app h-full w-full flex justify-center items-center relative">
      <style>
        {`
          .glow-on-hover {
            transition: filter 0.3s ease;
          }
          .glow-on-hover-white:hover {
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 1));
          }
          .glow-on-hover-red:hover {
            filter: drop-shadow(0 0 15px rgba(255, 0, 0, 1));
          }
          .svg-glow {
           transition: filter 0.3s ease;
          }

          button:hover .svg-glow {
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 1));
          }

          .text-glow {
            transition: text-shadow 0.3s ease, transform 0.1s ease;
          }

          .text-glow:hover {
            text-shadow: 0 0 14px rgba(255, 255, 255, 0.8);
          }
        `}
      </style>
      <div className="container absolute  flex flex-col md:flex-row p-5 md:p-8 w-full h-full md:w-[70%]  md:h-[85%] rounded-xl md:backdrop-blur-xl md:bg-gradient-to-br from-[#202024] to-[#25272b] md:shadow-[22px_22px_44px_#121214,-22px_-22px_44px_#34363c] overflow-hidden">
        <button
          className="absolute rounded-full  w-14 h-14 bg-[#141517]  flex justify-center items-center right-[2%] text-red-500 bottom-4  "
          onClick={togglePopupEvent}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8 glow-on-hover-white md:hover:size-10 transition-all duration-250 ease-in-out"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
        <button
          className="absolute top-3 right-14 md:top-4 md:right-4 flex justify-center items-center"
          onClick={resetCalendar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="size-7 md:size-6 stroke-slate-300 glow-on-hover-white hover:stroke-white hover:size-7 hover:rotate-90 transition-all duration-300 ease-in-out"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
        <div className="lefthalf flex flex-col items-start md:w-1/2 p-2 md:p-4">
          <span className="title text-3xl md:text-4xl font-bold font-sans text-white mb-2 md:mb-2">
            Calendar
          </span>
          <div>
            <div
              className=" date_container cursor-pointer hover:bg-[#1B1B1F] transition-all p-3 rounded-xl ease-in-out duration-300"
              onClick={returnToSelection}
              style={{
                transform: "translateX(-7%)",
              }}
            >
              <h2 className="text-violet-500 text-xl md:text-2xl font-bold">
                {displayDay}
              </h2>
              <div className="flex flex-row items-end">
                <h2 className="text-white text-5xl md:text-6xl">
                  {(selectedDate || currentDate).getDate()}
                </h2>
                <span className="text-slate-200">
                  /
                  {(selectedDate
                    ? selectedDate.getMonth() + 1
                    : currentDate.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}
                  /
                  {selectedDate
                    ? selectedDate.getFullYear()
                    : currentDate.getFullYear()}
                </span>
              </div>
            </div>
            <h2 className="text-gray-400 text-lg md:text-xl mt-3">
              No events today
            </h2>
          </div>
        </div>

        <div className="righthalf absolute w-full p-5 left-0 md:p-0 md:left-auto md:static flex justify-center items-center bottom-[20%] md:w-1/2">
          <div className="flex flex-col w-full md:w-[80%] transition-all ease-in-out duration-300">
            <div className="flex justify-between items-center w-full mb-2">
              <div
                className="flex items-end hover:bg-[#1B1B1F] -ml-[4%] rounded-l-full rounded-r-full p-4 transition-all ease-in-out duration-300"
                onClick={togglePopup}
              >
                <span className="text-violet-500 font-bold text-lg md:text-xl mr-2 mb-1 cursor-pointer">
                  {monthsOfYear[displayMonth]}
                </span>
                <span className="text-white font-bold text-2xl md:text-3xl cursor-pointer mb-1">
                  {displayYear}
                </span>
              </div>
              <div className="flex justify-between w-[25%] mr-1 md:mr-3.5 ">
                <button
                  className="bg-[#141517] flex justify-center items-center text-red-500 rounded-full w-8 h-8 "
                  onClick={() => changeMonth(-1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className=" w-4 h-4 glow-on-hover-white md:hover:w-5 md:hover:h-5 transition-all duration-250 ease-in-out "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  className="bg-[#141517] flex justify-center items-center text-red-500 rounded-full ml-3 w-8 h-8 "
                  onClick={() => changeMonth(1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4  glow-on-hover-white md:hover:w-5 md:hover:h-5 transition-all duration-250 ease-in-out"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="week-days cursor-default grid grid-cols-7 gap-1 text-center text-white mb-2 -ml-2 mr-2 ">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-bold">
                  {day}
                </div>
              ))}
            </div>
            <div className="days grid grid-cols-7 gap-1 text-center text-white">
              {[...Array(firstDayOfMonth).keys()].map((_, index) => (
                <span key={`empty-${index}`} />
              ))}
              {[...Array(daysInMonth).keys()].map((day) => {
                const date = day + 1;
                const isSelectedDate =
                  selectedDate &&
                  selectedDate.getDate() === date &&
                  selectedDate.getMonth() === displayMonth &&
                  selectedDate.getFullYear() === displayYear;
                const isCurrentDay = isToday(date);
                return (
                  <span
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className={`cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center ${
                      isSelectedDate
                        ? "bg-violet-500 text-white"
                        : isCurrentDay
                        ? "bg-red-500 text-white"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    {date}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        {isPopupVisible && (
          <div className="absolute inset-0 flex flex-col bg-black/60 backdrop-blur-[4px] md:rounded-xl transition-transform duration-300 ease-in-out">
            <div
              className={`absolute flex justify-center right-0 top-[15%] w-[60%] h-[40%] bg-[#2C2C2E] rounded-l-2xl ${
                isPopupVisible && isPopupOpen
                  ? "animate-popup-enter"
                  : "animate-popup-exit"
              } shadow-[inset_-4px_0px_6px_rgba(0,0,0,0.3)]`}
            >
              <span className="absolute right-5 top-1 mt-3 text-2xl font-bold font-sans text-slate-200">
                Date
              </span>
              <div className="w-[15%] h-full flex left-0 top-0 absolute  ">
                <button
                  className=" absolute w-10 h-10 top-4   flex justify-center items-center hover:justify-end hover:w-16 left-3 text-violet-500 text-3xl rounded-full bg-[#1B1B1F] transition-all duration-250 ease-in-out"
                  onClick={togglePopup}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3 md:w-8 md:h-8 glow-on-hover-white hover:right-2 md:hover:w-9 transition-all duration-250 ease-in-out"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
              <form
                className="absolute h-full w-[80%] flex flex-row items-center justify-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  SubmitDate(dayInput, monthInput, yearInput);
                }}
              >
                <input
                  className="rounded-xl w-[20%] bg-transparent text-center text-white font-semibold text-2xl focus:outline-none"
                  type="number"
                  value={dayInput}
                  onChange={(e) => setDayInput(e.target.value)}
                  min="1"
                  max={daysInMonth}
                  placeholder="Day"
                />
                <span className="text-slate-300">/</span>
                <select
                  className="rounded-xl w-[20%] bg-transparent text-center text-white font-semibold text-2xl focus:outline-none"
                  value={monthInput}
                  onChange={(e) => setMonthInput(parseInt(e.target.value))}
                >
                  {monthsOfYearShort.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <span className="text-slate-300">/</span>
                <input
                  className="rounded-xl w-[20%] bg-transparent text-center text-white font-semibold text-2xl focus:outline-none"
                  type="number"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  placeholder="Year"
                />
              </form>
              <button
                className="flex absolute bottom-2 text-white font-bold right-4 w-10 h-10 rounded-full bg-violet-700 items-center justify-center hover:scale-105 duration-300 hover:shadow-neon-violet"
                onClick={() => SubmitDate(dayInput, monthInput, yearInput)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {isPopupEventvisible && (
          <div className="backroundpopupblur w-full h-full absolute inset-0 flex flex-col bg-black/60 backdrop-blur-[4px] rounded-none md:rounded-xl transition-transform duration-300 ease-in-out items-center">
            <div
              className={`absolute flex justify-center  bottom-0 w-full md:w-[40%] h-[90%] bg-[#2C2C2E] rounded-t-2xl overflow-scroll no-scrollbar ${
                isPopupEventvisible && isPopupEventOpen
                  ? "animate-popup-up"
                  : "animate-popup-down"
              } md:shadow-[inset_0px_-4px_0px_rgba(0,0,0,0.3)]`}
            >
              <div className="sticky top-0 flex justify-center items-center bg-violet-700 w-full h-[14%] rounded-t-2xl z-10">
                <span className="text-xl font-bold font-sans text-slate-200">
                  New event
                </span>
                <button
                  className="absolute w-10 h-10 top-3 flex justify-center items-center left-5 text-red-500 text-3xl rounded-full bg-[#1B1B1F] transition-all duration-250 ease-in-out"
                  onClick={togglePopupEvent}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute w-2 h-3 md:w-8 md:h-8 glow-on-hover-white bottom-1 transition-all duration-250 ease-in-out"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
              <form className="flex flex-col gap-4 absolute w-full px-8 top-[20%]">
                <div className=" flex flex-row justify-evenly items-center w-full">
                  <input
                    className="p-2 rounded-xl border text-white w-full bg-[#4a484d] text-center border-none focus:outline-none"
                    type="Title"
                    name="Title"
                    placeholder="Title"
                  ></input>
                </div>
                <div className="flex flex-col  w-full rounded-2xl bg-[#1B1B1F] gap-4 p-6">
                  <div className=" flex flex-row justify-between items-center w-full">
                    <span className="text-white font-semibold mr-6">start</span>
                    <button
                      className="p-2 rounded-md w-[40%] h-[2.5rem] border text-white  bg-[#4a484d] border-none focus:outline-none mr-1"
                      onClick={toggleStartEventDate}
                    >
                      {selectedDateEventStart
                        ? `${selectedDateEventStart.getDate()}/${
                            selectedDateEventStart.getMonth() + 1
                          }/${selectedDateEventStart.getFullYear()}`
                        : `${currentDate.getDate()}/${
                            currentDate.getMonth() + 1
                          }/${currentDate.getFullYear()}`}
                    </button>
                    <button
                      className="p-2 rounded-md w-[40%] h-[2.5rem] border text-white  bg-[#4a484d] border-none focus:outline-none"
                      onClick={toggleStartEventTime}
                    >
                      starttime
                    </button>
                  </div>
                  {isStartEventDateopen && (
                    <div className=" eventSelectStart absolute w-full p-6 left-0 md:p-0 md:left-auto md:static flex justify-center items-center bottom-[20%] ">
                      <div className="flex flex-col w-full md:w-full transition-all ease-in-out duration-300">
                        <div className="flex justify-between items-center w-full mb-2">
                          <div
                            className="flex items-end hover:bg-[#1B1B1F] -ml-[4%] rounded-l-full rounded-r-full p-4 transition-all ease-in-out duration-300"
                         
                          >
                            <span className="text-violet-500 font-bold text-lg md:text-xl mr-2 mb-1 cursor-pointer">
                              {monthsOfYear[displayMonthEventStart]}
                            </span>
                            <span className="text-white font-bold text-2xl md:text-3xl cursor-pointer mb-1">
                              {displayYearEventStart}
                            </span>
                          </div>
                          <div className="flex justify-between w-[25%] mr-1 md:mr-3.5 ">
                            <button
                              className="bg-[#141517] flex justify-center items-center text-red-500 rounded-full w-8 h-8 "
                              onClick={(e) => changeMonthStartEvent(-1, e)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className=" w-4 h-4 glow-on-hover-white md:hover:w-5 md:hover:h-5 transition-all duration-250 ease-in-out "
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 19.5 8.25 12l7.5-7.5"
                                />
                              </svg>
                            </button>
                            <button
                              className="bg-[#141517] flex justify-center items-center text-red-500 rounded-full ml-3 w-8 h-8 "
                              onClick={(e) => changeMonthStartEvent(1, e)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4  glow-on-hover-white md:hover:w-5 md:hover:h-5 transition-all duration-250 ease-in-out"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="week-days cursor-default grid grid-cols-7 gap-3 text-center text-white mb-2 -ml-2 mr-2 ">
                          {[
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                          ].map((day) => (
                            <div key={day} className="font-bold">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="days grid grid-cols-7 gap-1 text-center text-white">
                          {[...Array(firstDayOfMonthEventDateStart).keys()].map(
                            (_, index) => (
                              <span key={`empty-${index}`} />
                            )
                          )}
                          {[...Array(daysInMonthEventDateStart).keys()].map(
                            (day) => {
                              const date = day + 1;
                              const isSelectedDateEventStart =
                                selectedDateEventStart &&
                                selectedDateEventStart.getDate() === date &&
                                selectedDateEventStart.getMonth() ===
                                  displayMonthEventStart &&
                                selectedDateEventStart.getFullYear() ===
                                  displayYearEventStart;

                              return (
                                <span
                                  key={date}
                                  onClick={() =>
                                    handleDateClickEventStart(date)
                                  }
                                  className={`cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center ${
                                    isSelectedDateEventStart
                                      ? "bg-violet-500 text-white"
                                      : "hover:bg-gray-700"
                                  }`}
                                >
                                  {date}
                                </span>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className=" flex flex-row justify-between items-center w-full">
                    <span className="text-white font-semibold mr-7">end</span>
                    <button
                      className="p-2 rounded-md w-[40%] h-[2.5rem] border text-white  bg-[#4a484d] border-none focus:outline-none mr-1"
                      onClick={toggleEndEventDate}
                    >
                      {selectedDateEventEnd
                        ? `${selectedDateEventEnd.getDate()}/${
                            selectedDateEventEnd.getMonth() + 1
                          }/${selectedDateEventEnd.getFullYear()}`
                        : `${currentDate.getDate()}/${
                            currentDate.getMonth() + 1
                          }/${currentDate.getFullYear()}`}
                    </button>
                    <button
                      className="p-2 rounded-md w-[40%] h-[2.5rem] border text-white  bg-[#4a484d] border-none focus:outline-none"
                      onClick={toggleEndEventTime}
                    >
                      starttime
                    </button>
                  </div>
                  {isEndEventDateopen && (
                    <div className=" eventSelectStart absolute w-full p-6 left-0 md:p-0 md:left-auto md:static flex justify-center items-center bottom-[20%] ">
                      <div className="flex flex-col w-full md:w-full transition-all ease-in-out duration-300">
                        <div className="flex justify-between items-center w-full mb-2">
                          <div
                            className="flex items-end hover:bg-[#1B1B1F] -ml-[4%] rounded-l-full rounded-r-full p-4 transition-all ease-in-out duration-300"
                            
                          >
                            <span className="text-violet-500 font-bold text-lg md:text-xl mr-2 mb-1 cursor-pointer">
                              {monthsOfYear[displayMonthEventEnd]}
                            </span>
                            <span className="text-white font-bold text-2xl md:text-3xl cursor-pointer mb-1">
                              {displayYearEventEnd}
                            </span>
                          </div>
                          <div className="flex justify-between w-[25%] mr-1 md:mr-3.5 ">
                            <button
                              className="bg-[#141517] flex justify-center items-center text-red-500 rounded-full w-8 h-8 "
                              onClick={(e) => changeMonthEndEvent(-1, e)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className=" w-4 h-4 glow-on-hover-white md:hover:w-5 md:hover:h-5 transition-all duration-250 ease-in-out "
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 19.5 8.25 12l7.5-7.5"
                                />
                              </svg>
                            </button>
                            <button
                              className="bg-[#141517] flex justify-center items-center text-red-500 rounded-full ml-3 w-8 h-8 "
                              onClick={(e) => changeMonthEndEvent(1, e)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4  glow-on-hover-white md:hover:w-5 md:hover:h-5 transition-all duration-250 ease-in-out"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="week-days cursor-default grid grid-cols-7 gap-3 text-center text-white mb-2 -ml-2 mr-2 ">
                          {[
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                          ].map((day) => (
                            <div key={day} className="font-bold">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="days grid grid-cols-7 gap-1 text-center text-white">
                          {[...Array(firstDayOfMonthEventDateEnd).keys()].map(
                            (_, index) => (
                              <span key={`empty-${index}`} />
                            )
                          )}
                          {[...Array(daysInMonthEventDateEnd).keys()].map(
                            (day) => {
                              const date = day + 1;
                              const isSelectedDateEventEnd =
                                selectedDateEventEnd &&
                                selectedDateEventEnd.getDate() === date &&
                                selectedDateEventEnd.getMonth() ===
                                  displayMonthEventEnd &&
                                selectedDateEventEnd.getFullYear() ===
                                  displayYearEventEnd;

                              return (
                                <span
                                  key={date}
                                  onClick={() =>
                                    handleDateClickEventEnd(date)
                                  }
                                  className={`cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center ${
                                    isSelectedDateEventEnd
                                      ? "bg-violet-500 text-white"
                                      : "hover:bg-gray-700"
                                  }`}
                                >
                                  {date}
                                </span>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
