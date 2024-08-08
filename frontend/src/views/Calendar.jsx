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

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();

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

  const resetCalendar = () => {
    setDisplayMonth(currentDate.getMonth());
    setDisplayYear(currentDate.getFullYear());
    setSelectedDate(null);
  };

  const isToday = (day) =>
    day === currentDate.getDate() &&
    currentDate.getMonth() === displayMonth &&
    currentDate.getFullYear() === displayYear;

  const handleDateClick = (day) => {
    setSelectedDate(new Date(displayYear, displayMonth, day));
  };

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  const togglePopupEvent = () => {
    setPopupEventOpen(!isPopupEventOpen);
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
    }
  };

  useEffect(() => {
    console.log("Display Month:", displayMonth);
    console.log("Display Year:", displayYear);
    console.log("Selected Date:", selectedDate);
  }, [displayMonth, displayYear, selectedDate]);

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
        `}
      </style>
      <div className="container flex flex-col md:flex-row p-4 md:p-8 w-[90%] h-[90%] md:w-[60%]  md:h-[70%] rounded-xl backdrop-blur-xl md:bg-gradient-to-br from-[#202024] to-[#25272b] md:shadow-[22px_22px_44px_#121214,-22px_-22px_44px_#34363c] overflow-hidden">
        <button
          className="absolute rounded-full w-11 h-11 bg-[#141517]  flex justify-center items-center right-[2%] text-red-500 bottom-4  "
          onClick={togglePopupEvent}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-7 glow-on-hover-white md:hover:size-8 transition-all duration-250 ease-in-out"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
        <div className="lefthalf flex flex-col items-start w-1/2 p-2 md:p-4">
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

        <div className="righthalf flex justify-center items-center w-1/2">
          <button
            className="absolute top-4 right-4 flex justify-center items-center"
            onClick={resetCalendar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              className="size-6 stroke-slate-300 glow-on-hover-white hover:stroke-white hover:size-7 transition-all duration-300 ease-in-out"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
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
              <div className="flex justify-between w-[15%] mr-1 md:w-[25%]">
                <button
                  className="bg-[#141517] flex justify-center items-center text-red-500 rounded-full w-5 h-5 md:w-8 md:h-8"
                  onClick={() => changeMonth(-1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3 md:w-4 md:h-4 glow-on-hover-white md:hover:w-5 md:hover:h-5 transition-all duration-250 ease-in-out "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  className="bg-[#141517] flex justify-center items-center text-red-500 rounded-full ml-3 w-5 h-5 md:w-8 md:h-8"
                  onClick={() => changeMonth(1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3 md:w-4 md:h-4 glow-on-hover-white md:hover:w-5 md:hover:h-5 transition-all duration-250 ease-in-out"
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
            <div className="week-days cursor-default grid grid-cols-7 gap-1 text-center text-white mb-2">
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
          <div className="fixed inset-0 flex flex-col bg-black/60 backdrop-blur-[4px] rounded-xl transition-transform duration-300 ease-in-out">
            <div
              className={`absolute flex justify-center right-0 top-[15%] w-[60%] h-[40%] bg-orange-600 rounded-l-2xl ${
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
                    className="w-3 h-3 md:w-8 md:h-8 svg-glow hover:right-2 md:hover:w-9 transition-all duration-250 ease-in-out"
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
          <div className="fixed inset-0 flex flex-col bg-black/60 backdrop-blur-[4px] rounded-xl transition-transform duration-300 ease-in-out items-center">
            <div
              className={`absolute flex justify-center items-center bottom-0 w-[40%] h-[90%] bg-[#2C2C2E] rounded-t-2xl ${
                isPopupEventvisible && isPopupEventOpen
                  ? "animate-popup-up"
                  : "animate-popup-down"
              } shadow-[inset_0px_-4px_0px_rgba(0,0,0,0.3)]`}
            >
              <span className=" absolute top-3  mt-3 text-xl font-bold font-sans text-slate-200">
                New event
              </span>
              <button
                className=" absolute w-10 h-10 top-3   flex justify-center items-center  hover:h-16 left-4 text-violet-500 text-3xl rounded-full bg-[#1B1B1F] transition-all duration-250 ease-in-out"
                onClick={togglePopupEvent}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="absolute w-2 h-3 md:w-8 md:h-8 svg-glow bottom-1  transition-all duration-250 ease-in-out"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
