import React, { useState, useEffect, useContext } from "react";
import { makeRequest } from "../../axios";
import Events from "./events";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Activities from "./Activities";
import CreateEvent from "./CreateEvent";
import { AuthContext } from "../../context/authcontext";
import io from "socket.io-client";

const socket = io("http://localhost:8800", {
  transports: ["websocket"],
});


function Calendar() {
  const queryClient = useQueryClient();
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

  const [displayMonthEventStart, setDisplayMonthEventStart] = useState(
    currentDate.getMonth()
  );
  const [displayYearEventStart, setDisplayYearEventStart] = useState(
    currentDate.getFullYear()
  );
  const [selectedDateEventStart, setSelectedDateEventStart] =
    useState(currentDate);
  const [displayMonthEventEnd, setDisplayMonthEventEnd] = useState(
    currentDate.getMonth()
  );
  const [displayYearEventEnd, setDisplayYearEventEnd] = useState(
    currentDate.getFullYear()
  );
  const [selectedDateEventEnd, setSelectedDateEventEnd] = useState(currentDate);

  const [eventType, setEventType] = useState("event");

  const [endFreqDate, setEndFreqDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [isEventDateStartManuallySet, setIsEventDateStartManuallySet] =
    useState(false);
  const [isEventDateEndManuallySet, setIsEventDateEndManuallySet] =
    useState(false);

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
    setSelectedDateEventStart(currentDate);
    setSelectedDateEventEnd(currentDate);
    setIsEventDateStartManuallySet(false);
    setIsEventDateEndManuallySet(false);
  };

  const isToday = (day) => {
    return (
      day === currentDate.getDate() &&
      currentDate.getMonth() === displayMonth &&
      currentDate.getFullYear() === displayYear
    );
  };

  const handleDateClick = (day) => {
    const selectedDateUTC = new Date(Date.UTC(displayYear, displayMonth, day));
    setSelectedDate(selectedDateUTC);
    setDisplayMonthEventStart(displayMonth);
    setDisplayMonthEventEnd(displayMonth);
    setDisplayYearEventStart(displayYear);
    setDisplayYearEventEnd(displayYear);
    setSelectedDateEventStart(selectedDateUTC);
    setSelectedDateEventEnd(selectedDateUTC);
  };

  useEffect(() => {
    if (!isEventDateStartManuallySet && selectedDate !== null) {
      if (selectedDate && selectedDateEventStart !== selectedDate) {
        setSelectedDateEventStart(selectedDate);
      } else if (!selectedDate && selectedDateEventStart !== currentDate) {
        setSelectedDateEventStart(currentDate);
      }
    }
  }, [
    selectedDate,
    currentDate,
    isEventDateStartManuallySet,
    selectedDateEventStart,
  ]);

  useEffect(() => {
    if (selectedDateEventEnd < selectedDateEventStart) {
      setSelectedDateEventEnd(selectedDateEventStart);
    }
  }, [selectedDateEventStart, selectedDateEventEnd]);

  useEffect(() => {
    if (
      isEventDateStartManuallySet &&
      !isEventDateEndManuallySet &&
      selectedDate !== null
    ) {
      if (selectedDateEventEnd < selectedDateEventStart) {
      }
      if (
        selectedDateEventEnd > selectedDateEventStart &&
        selectedDate &&
        selectedDateEventEnd !== currentDate
      ) {
        setSelectedDateEventEnd(selectedDate);
      } else if (!selectedDate && selectedDateEventEnd !== currentDate) {
        setSelectedDateEventEnd(currentDate);
      }
    }
  }, [
    selectedDate,
    currentDate,
    isEventDateEndManuallySet,
    selectedDateEventEnd,
    selectedDateEventStart,
    isEventDateStartManuallySet,
  ]);

  useEffect(() => {
    if (selectedDateEventEnd > new Date(endFreqDate)) {
      setEndFreqDate(selectedDateEventEnd.toISOString().split("T")[0]);
    }
  }, [selectedDateEventEnd, endFreqDate]);

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

   const [eventDayss, setEventDayss] = useState(null);

   const eventDaysMutation = useMutation(
     () => {
       return makeRequest
         .get(`/events/getAllEvents/${displayMonth}/${displayYear}`)
         .then((res) => {
        
           return res.data;
         });
     },
     {
       onSuccess: (data) => {
     
         setEventDayss(data); 
       },
 
     }
   );

    const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      socket.emit("join", currentUser._id);

      const handleEventDays = () => {
        eventDaysMutation.mutate();
      };

      socket.on("eventDays", handleEventDays);

      return () => {
        socket.off("eventDays", handleEventDays);
      };
    }

    return () => {};
  }, [currentUser]);

   useEffect(() => {
   
       eventDaysMutation.mutate();
     
   }, [displayMonth, displayYear]);

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
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8 glow-on-hover-white md:hover:size-10 transition-all duration-250 ease-in-out"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
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
          </div>
          <div className="eventList flex w-full h-full overflow-scroll no-scrollbar ">
            <Events selectedDate={selectedDate} currentDate={currentDate} eventDaysMutation={eventDaysMutation} />
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
                  onClick={(e) => {
                    e.preventDefault();
                    changeMonth(-1);
                    queryClient.invalidateQueries(["eventDays"], {
                      refetchActive: true,
                    });
                  }}
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
                  onClick={(e) => {
                    e.preventDefault();
                    changeMonth(1);
                    queryClient.invalidateQueries(["eventDays"], {
                      refetchActive: true,
                    });
                  }}
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

                const currentDateFormatted = `${String(date).padStart(
                  2,
                  "0"
                )}-${String(displayMonth).padStart(2, "0")}-${displayYear}`;

                const isEventDay = eventDayss?.includes(currentDateFormatted);

                return (
                  <span
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className={`cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center ${
                      isSelectedDate
                        ? "bg-violet-500 text-white "
                        : isCurrentDay
                        ? "bg-red-500  "
                        : "hover:bg-gray-700"
                    }  ${isEventDay && !isSelectedDate ? "text-lime-300" : ""}`}
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
              <div className="sticky top-0 z-50 flex justify-between px-6 items-center bg-violet-700 w-full h-[14%] rounded-t-2xl ">
                <span className="text-xl font-bold font-sans text-slate-200">
                  New {eventType}
                </span>
                <button
                  className="absolute p-2 top-4 flex justify-center items-center right-5 text-red-500 text-3xl rounded-full bg-[#1B1B1F] transition-all duration-250 ease-in-out"
                  onClick={togglePopupEvent}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className=" size-6  glow-on-hover-white bottom-1 transition-all duration-250 ease-in-out"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {eventType === "event" && (
                <CreateEvent
                  selecteddate={selectedDate}
                  eventType={eventType}
                  setEventType={setEventType}
                  currentdate={currentDate}
                  setPopupEventOpen={setPopupEventOpen}
                  displayYear={displayYear}
                  displayMonth={displayMonth}
                  selectedDateEventStart={selectedDateEventStart}
                  selectedDateEventEnd={selectedDateEventEnd}
                  setSelectedDateEventStart={setSelectedDateEventStart}
                  setSelectedDateEventEnd={setSelectedDateEventEnd}
                  displayMonthEventStart={displayMonthEventStart}
                  displayMonthEventEnd={displayMonthEventEnd}
                  setDisplayMonthEventStart={setDisplayMonthEventStart}
                  setDisplayMonthEventEnd={setDisplayMonthEventEnd}
                  displayYearEventStart={displayYearEventStart}
                  displayYearEventEnd={displayYearEventEnd}
                  setDisplayYearEventStart={setDisplayYearEventStart}
                  setDisplayYearEventEnd={setDisplayYearEventEnd}
                  eventDaysMutation={eventDaysMutation}
                />
              )}
              {eventType === "activity" && (
                <Activities
                  eventType={eventType}
                  setEventType={setEventType}
                  setPopupEventOpen={setPopupEventOpen}
                  eventDaysMutation={eventDaysMutation}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
