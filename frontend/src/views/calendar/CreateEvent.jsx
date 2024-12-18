import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";

function CreateEvent({
  selecteddate,
  eventType,
  setEventType,
  setPopupEventOpen,
  displayYear, 
  displayMonth,
  selectedDateEventStart,
  selectedDateEventEnd,
  displayMonthEventStart,
  displayMonthEventEnd,
  setSelectedDateEventStart,
  setSelectedDateEventEnd,
  setDisplayMonthEventStart,
  setDisplayMonthEventEnd,
  displayYearEventStart,
  displayYearEventEnd,
  setDisplayYearEventStart,
  setDisplayYearEventEnd
}) {
  const queryClient = useQueryClient();

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

  const currentDate = new Date();
  const selectedDate = selecteddate ? new Date(selecteddate) : null;
  const [isStartEventDateopen, setStartEventDateopen] = useState(false);
  const [isStartEventTimeopen, setStartEventTimeopen] = useState(false);
  const [isEndEventDateopen, setEndEventDateopen] = useState(false);
  const [isEndEventTimeopen, setEndEventTimeopen] = useState(false);

  const [unSelectedType, setUnselectedType] = useState("activity");
  const [isTypeSelectOpen, setTypeSelectOpen] = useState(false);
  const [frequenza, setFrequenza] = useState("Never");
  const [isFrequenza, setIsfrequenza] = useState(false);
  const [pDays, setPdays] = useState([]);
  const [pDates, setPdates] = useState(false);
  const [pDatesArray, setPdatesArray] = useState([]);
  const [fotm, setFotm] = useState(false);
  const [eotm, setEotm] = useState(false);

  const [endFreqDate, setEndFreqDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [Pomodoro, setPomodoro] = useState(false);
  const [PomTimehrs, setPomTimehrs] = useState("00");
  const [PomTimemin, setPomTimemin] = useState("00");
  const [maxPomTimehrs, setMaxPomTimehrs] = useState(0);
  const [maxPomTimemin, setMaxPomTimemin] = useState(0);

  const [isEventDateStartManuallySet, setIsEventDateStartManuallySet] =
    useState(false);
  const [isEventDateEndManuallySet, setIsEventDateEndManuallySet] =
    useState(false);

  const [title, setTitle] = useState("");
  const [hoursStart, setHoursStart] = useState(0);
  const [minutesStart, setMinutesStart] = useState(0);
  const [hoursEnd, setHoursEnd] = useState(0);
  const [minutesEnd, setMinutesEnd] = useState(0);
  const [description, setDescription] = useState("");

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

  const handleIncrementTime = (type, e) => {
    e.preventDefault();
    if (type === "hoursStart") {
      setHoursStart((prev) => (prev + 1 + 24) % 24);
    } else if (type === "minutesStart") {
      setMinutesStart((prev) => (prev + 1 + 60) % 60);
    } else if (type === "hoursEnd") {
      setHoursEnd((prev) => (prev + 1 + 24) % 24);
    } else if (type === "minutesEnd") {
      setMinutesEnd((prev) => (prev + 1 + 60) % 60);
    }
  };

  const handleDecrementTime = (type, e) => {
    e.preventDefault();
    if (type === "hoursStart") {
      setHoursStart((prev) => (prev - 1 + 24) % 24);
    } else if (type === "minutesStart") {
      setMinutesStart((prev) => (prev - 1 + 60) % 60);
    } else if (type === "hoursEnd") {
      setHoursEnd((prev) => (prev - 1 + 24) % 24);
    } else if (type === "minutesEnd") {
      setMinutesEnd((prev) => (prev - 1 + 60) % 60);
    }
  };

  const selectEventType = (e) => {
    e.preventDefault();
    setTypeSelectOpen(!isTypeSelectOpen);
  };

  const toggleStartEventDate = (e) => {
    e.preventDefault();
    setStartEventDateopen(!isStartEventDateopen);
    setStartEventTimeopen(false);
  };

  const toggleEndEventDate = (e) => {
    e.preventDefault();
    setEndEventDateopen(!isEndEventDateopen);
    setEndEventTimeopen(false);
  };

  const toggleStartEventTime = (e) => {
    e.preventDefault();
    setStartEventTimeopen(!isStartEventTimeopen);
    setStartEventDateopen(false);
  };

  const toggleEndEventTime = (e) => {
    e.preventDefault();
    setEndEventTimeopen(!isEndEventTimeopen);
    setEndEventDateopen(false);
  };


  const mutation = useMutation(
    ({startISO, endISO, PomodoroHours, PomodoroMinutes}) => {
      return makeRequest.post("/events", {
        title,
        selectedDateEventStart: startISO,
        selectedDateEventEnd: endISO,
        description,
        eventType,
        frequenza,
        endFrequenza: new Date(endFreqDate),
        Pomodoro,
        PomodoroHours,
        PomodoroMinutes,
        personalizedDays: pDays,
        personalizedDates: pDates,
        personalizedDatesArray: pDatesArray,
        fotm,
        eotm,
        displayMonth,
        displayYear,
      });
    }, {
      onSuccess: async ()=>{
        queryClient.invalidateQueries(["events"], { refetchActive: true });
       await queryClient.invalidateQueries(["eventDays"], { refetchActive: true });
      
        setEndEventDateopen(false);
        setStartEventDateopen(false);
        setEndEventTimeopen(false);
        setStartEventTimeopen(false);
        setHoursStart(0);
        setHoursEnd(0);
        setMinutesStart(0);
        setMinutesEnd(0);
        setPopupEventOpen(false);
        const resetDate = selectedDate || currentDate;
        setSelectedDateEventStart(resetDate);
        setSelectedDateEventEnd(resetDate);
        setTitle("");
        setDescription("");
      }
    }
  );

  const SubmitEvent = async (e) => {
    e.preventDefault();
    try {
    const formattedStartDate = new Date(selectedDateEventStart);
    const formattedEndDate = new Date(selectedDateEventEnd);

   
    formattedStartDate.setUTCHours(hoursStart);
    formattedStartDate.setUTCMinutes(minutesStart);
    formattedEndDate.setUTCHours(hoursEnd);
    formattedEndDate.setUTCMinutes(minutesEnd);

    const startISO = formattedStartDate.toISOString();
    const endISO = formattedEndDate.toISOString();

   
   
      
      const PomodoroHours = parseInt(PomTimehrs, 10);
      const PomodoroMinutes = parseInt(PomTimemin, 10);

      mutation.mutate({startISO, endISO, PomodoroHours, PomodoroMinutes});
    } catch (error) {
      console.error(error);
    }
  };

  const changeType = (e) => {
    e.preventDefault();
    eventType === "event" ? setEventType("activity") : setEventType("event");
    unSelectedType === "event"
      ? setUnselectedType("activity")
      : setUnselectedType("event");
    setTypeSelectOpen(false);
  };
  const toggleFrequenza = (e) => {
    e.preventDefault();
    setIsfrequenza(!isFrequenza);
  };

  const changePomoTime = (e, offset) => {
    e.preventDefault();
    const maxPomoTime = maxPomTimehrs * 60 + maxPomTimemin;
    let PomoTime = parseInt(PomTimehrs, 10) * 60 + parseInt(PomTimemin, 10);
    if (PomoTime + offset <= maxPomoTime && PomoTime + offset >= 0) {
      PomoTime += offset;
      setPomTimehrs(String(Math.floor(PomoTime / 60)).padStart(2, "0"));
      setPomTimemin(String(PomoTime % 60).padStart(2, "0"));
    } else if (PomoTime + offset > maxPomoTime) {
      setPomTimehrs(String(maxPomTimehrs).padStart(2, "0"));
      setPomTimemin(String(maxPomTimemin).padStart(2, "0"));
    } else if (PomoTime + offset < 0) {
      setPomTimehrs("00");
      setPomTimemin("00");
    }
  };

  const togglepDay = (e, day) => {
    e.preventDefault();
    setPdays((prevdays) => {
      if (prevdays.includes(day)) {
        return prevdays.filter((d) => d !== day);
      } else {
        return [...prevdays, day];
      }
    });
  };

  const addPdatesArray = (e, day) => {
    e.preventDefault();
    setPdatesArray((prevdates) => {
      if (prevdates.includes(day)) {
        return prevdates.filter((d) => d !== day);
      } else {
        return [...pDatesArray, day];
      }
    });
  };

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

useEffect(() => {
  if (!isEventDateStartManuallySet && selectedDate !== null) {
    if (
      selectedDate &&
      selectedDateEventStart?.toISOString() !== selectedDate.toISOString()
    ) {
      setSelectedDateEventStart(selectedDate);
    } else if (
      !selectedDate &&
      selectedDateEventStart?.toISOString() !== currentDate.toISOString()
    ) {
      setSelectedDateEventStart(currentDate);
    }
  }
}, [
  selectedDate,
  currentDate,
  isEventDateStartManuallySet,
  selectedDateEventStart,
]);


  const handleDateClickEventStart = (day) => {
    const selectedDateUTC = new Date(
      Date.UTC(displayYearEventStart, displayMonthEventStart, day)
    );
    setSelectedDateEventStart(selectedDateUTC);
    setIsEventDateStartManuallySet(true);
  };

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
    setSelectedDateEventEnd
  ]);

  const handleDateClickEventEnd = (day) => {
    const selectedEndDateUTC = new Date(
      Date.UTC(displayYearEventEnd, displayMonthEventEnd, day)
    );

    if (selectedEndDateUTC < selectedDateEventStart) {
      setSelectedDateEventEnd(selectedDateEventStart);
    } else {
      setSelectedDateEventEnd(selectedEndDateUTC);
    }

    setIsEventDateEndManuallySet(true);
  };

  useEffect(() => {
    if (selectedDateEventEnd > new Date(endFreqDate)) {
      setEndFreqDate(selectedDateEventEnd.toISOString().split("T")[0]);
    }
  }, [selectedDateEventEnd, endFreqDate]);

  const resetEventDate = () => {
    setIsEventDateStartManuallySet(false);
    setIsEventDateEndManuallySet(false);
  };

  useEffect(() => {
    if (selectedDateEventStart && selectedDateEventEnd) {
      const startDateTime = new Date(selectedDateEventStart);
      startDateTime.setHours(hoursStart, minutesStart, 0, 0);

      const endDateTime = new Date(selectedDateEventEnd);
      endDateTime.setHours(hoursEnd, minutesEnd, 0, 0);

      const TimeDifference = endDateTime - startDateTime;

      if (TimeDifference > 0) {
        const newHours = Math.floor(TimeDifference / (1000 * 60 * 60));
        const newMinutes = Math.floor(
          (TimeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (newHours !== maxPomTimehrs || newMinutes !== maxPomTimemin) {
          setMaxPomTimehrs(newHours);
          setMaxPomTimemin(newMinutes);
        }
      } else if (maxPomTimehrs !== 0 || maxPomTimemin !== 0) {
        setMaxPomTimehrs(0);
        setMaxPomTimemin(0);
      }
    }
  }, [
    selectedDateEventStart,
    hoursStart,
    minutesStart,
    selectedDateEventEnd,
    hoursEnd,
    minutesEnd,
    maxPomTimehrs,
    maxPomTimemin,
  ]);


  useEffect(() => {
    const totlalpommin =
      parseInt(PomTimehrs, 10) * 60 + parseInt(PomTimemin, 10);
    const maxpommin = maxPomTimehrs * 60 + maxPomTimemin;
    if (totlalpommin > maxpommin) {
      setPomTimehrs(String(maxPomTimehrs).padStart(2, "0"));
      setPomTimemin(String(maxPomTimemin).padStart(2, "0"));
    }
  }, [PomTimehrs, PomTimemin, maxPomTimehrs, maxPomTimemin]);



  return (
    <form className="flex flex-col gap-4 absolute w-full h-full px-8 top-[20%]">
      <div className=" flex flex-row items-center w-full z-10 ">
        <input
          className=" flex l-0 p-2 rounded-xl border text-white w-[65%] bg-[#4a484d] text-center border-none focus:outline-none"
          type="Title"
          name="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Title"
        ></input>

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
        <span className="eventType text-white ">{eventType}</span>
      </div>
      <div className="flex flex-col  w-full rounded-2xl bg-[#1B1B1F] gap-4 p-6 z-1">
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
            {String(hoursStart).padStart(2, "0")}:
            {String(minutesStart).padStart(2, "0")}
          </button>
        </div>
        {isStartEventDateopen && (
          <div className=" eventSelectStart absolute w-full p-6 left-0 md:p-0 md:left-auto md:static flex justify-center items-center bottom-[20%] ">
            <div className="flex flex-col w-full md:w-full transition-all ease-in-out duration-300">
              <div className="flex justify-between items-center w-full mb-2">
                <div className="flex items-end hover:bg-[#1B1B1F] -ml-[4%] rounded-l-full rounded-r-full p-4 transition-all ease-in-out duration-300">
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
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="font-bold">
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="days grid grid-cols-7 gap-1 text-center text-white">
                {[...Array(firstDayOfMonthEventDateStart).keys()].map(
                  (_, index) => (
                    <span key={`empty-${index}`} />
                  )
                )}
                {[...Array(daysInMonthEventDateStart).keys()].map((day) => {
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
                      onClick={() => handleDateClickEventStart(date)}
                      className={`cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center ${
                        isSelectedDateEventStart
                          ? "bg-violet-500 text-white"
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
        )}
        {isStartEventTimeopen && (
          <div className=" TimeStart absolute w-full  p-6 left-0 md:p-0 md:left-auto md:static flex justify-center items-center bottom-[20%]">
            <div className="hours flex flex-col relative  mr-2  h-full">
              <button
                className="flex w-7 h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl mb-2"
                onClick={(e) => handleDecrementTime("hoursStart", e)}
              >
                -
              </button>
              <input
                className=" bg-[#4a484d] text-center w-7 text-white  border-none focus:outline-none rounded-lg "
                type=""
                value={String(hoursStart).padStart(2, "0")}
                readOnly
              />
              <button
                className="flex w-7 h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl mt-2"
                onClick={(e) => handleIncrementTime("hoursStart", e)}
              >
                +
              </button>
            </div>
            <span className="text-xl font-bold text-white">:</span>
            <div className="minutes flex flex-col relative  ml-2  h-full ">
              <button
                className="flex w-7 h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl mb-2"
                onClick={(e) => handleDecrementTime("minutesStart", e)}
              >
                -
              </button>
              <input
                className=" bg-[#4a484d] text-center w-7 text-white  border-none focus:outline-none rounded-lg "
                type=""
                value={String(minutesStart).padStart(2, "0")}
                readOnly
              />
              <button
                className="flex w-7 h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl mt-2"
                onClick={(e) => handleIncrementTime("minutesStart", e)}
              >
                +
              </button>
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
            {String(hoursEnd).padStart(2, "0")}:
            {String(minutesEnd).padStart(2, "0")}
          </button>
        </div>
        {isEndEventDateopen && (
          <div className=" eventSelectEnd absolute w-full p-6 left-0 md:p-0 md:left-auto md:static flex justify-center items-center bottom-[20%] ">
            <div className="flex flex-col w-full md:w-full transition-all ease-in-out duration-300">
              <div className="flex justify-between items-center w-full mb-2">
                <div className="flex items-end hover:bg-[#1B1B1F] -ml-[4%] rounded-l-full rounded-r-full p-4 transition-all ease-in-out duration-300">
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
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="font-bold">
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="days grid grid-cols-7 gap-1 text-center text-white">
                {[...Array(firstDayOfMonthEventDateEnd).keys()].map(
                  (_, index) => (
                    <span key={`empty-${index}`} />
                  )
                )}
                {[...Array(daysInMonthEventDateEnd).keys()].map((day) => {
                  const date = day + 1;
                  const isSelectedDateEventEnd =
                    selectedDateEventEnd &&
                    selectedDateEventEnd.getDate() === date &&
                    selectedDateEventEnd.getMonth() === displayMonthEventEnd &&
                    selectedDateEventEnd.getFullYear() === displayYearEventEnd;

                  return (
                    <span
                      key={date}
                      onClick={() => handleDateClickEventEnd(date)}
                      className={`cursor-pointer rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center ${
                        isSelectedDateEventEnd
                          ? "bg-violet-500 text-white"
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
        )}
        {isEndEventTimeopen && (
          <div className=" TimeEnd absolute w-full  p-6 left-0 md:p-0 md:left-auto md:static flex justify-center items-center bottom-[20%]">
            <div className="hours flex flex-col relative  mr-2  h-full ">
              <button
                className="flex  h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl mb-2"
                onClick={(e) => handleIncrementTime("hoursEnd", e)}
              >
                +
              </button>
              <input
                className=" r-0  bg-[#4a484d] text-center w-7 text-white  border-none focus:outline-none rounded-lg"
                type=""
                value={String(hoursEnd).padStart(2, "0")}
                readOnly
              />
              <button
                className="flex  h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl mt-2"
                onClick={(e) => handleDecrementTime("hoursEnd", e)}
              >
                -
              </button>
            </div>
            <span className="text-xl font-bold text-white">:</span>
            <div className="minutes flex flex-col relative  ml-2  h-full ">
              <button
                className="flex w-7  h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl mb-2"
                onClick={(e) => handleIncrementTime("minutesEnd", e)}
              >
                +
              </button>
              <input
                className=" bg-[#4a484d] text-center w-7 text-white  border-none focus:outline-none rounded-lg "
                type=""
                value={String(minutesEnd).padStart(2, "0")}
                readOnly
              />
              <button
                className="flex w-7 h-full l-0 bg-violet-600  text-white justify-center items-center rounded-xl mt-2"
                onClick={(e) => handleDecrementTime("minutesEnd", e)}
              >
                -
              </button>
            </div>
          </div>
        )}
      </div>
      {isTypeSelectOpen && (
        <div className=" absolute items-center right-9 flex flex-col bg-black z-2 rounded-2xl w-[27%] min-h-[17%] ">
          <button
            className="flex absolute text-white ml-1 bottom-4"
            onClick={changeType}
          >
            {unSelectedType}
          </button>
        </div>
      )}
      <textarea
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className=" p-2 rounded-xl border text-white w-full min-h-[30%] bg-[#4a484d]  border-none focus:outline-none resize-none"
        placeholder="Description"
      />
      <div>
        <button
          onClick={toggleFrequenza}
          className="bg-[#1B1B1F] h-10 rounded-xl w-full p-4 flex justify-between items-center"
        >
          <div className="text-white">frequency</div>
          <div className=" text-slate-400">{frequenza}</div>
        </button>
        {isFrequenza && (
          <div className=" flex flex-col bg-[#4a484d] w-[50%] rounded-xl font-bold text-slate-300 p-4 gap-2 right-2 ml-auto mr-2 mt-1 mb-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                setFrequenza("Every day");
                setIsfrequenza(false);
              }}
            >
              Every day
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setFrequenza("Every week");
                setIsfrequenza(false);
              }}
            >
              Every week
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setFrequenza("Every month");
                setIsfrequenza(false);
              }}
            >
              Every month
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setFrequenza("Every year");
                setIsfrequenza(false);
              }}
            >
              Every year
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setFrequenza("Personalize");
                setIsfrequenza(false);
              }}
            >
              Personalize
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setFrequenza("Never");
                setIsfrequenza(false);
              }}
            >
              Never
            </button>
          </div>
        )}
        {frequenza !== "Never" && (
          <div className="bg-[#1B1B1F] h-12 rounded-b-xl -mt-3 w-full p-4 flex  items-center ">
            <div className="text-white">End repetition</div>
            <div className="flex flex-row bg-none text-white w-auto ml-auto mr-0">
              <input
                className="bg-transparent"
                type="date"
                id="start"
                name="trip-start"
                value={endFreqDate}
                min="1900-01-01"
                max="2038-12-31"
                onChange={(e) => setEndFreqDate(e.target.value)}
              />
            </div>
          </div>
        )}
        {frequenza === "Personalize" && (
          <div>
            <div className="flex flex-row justify-between items-center bg-[#1B1B1F] h-12 rounded-b-xl -mt-3 w-full p-4 text-white font-bold">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                <button
                  key={day}
                  onClick={(e) => togglepDay(e, day)}
                  className={`transition-colors ${
                    pDays.includes(day)
                      ? "text-violet-400"
                      : "text-white hover:text-slate-400"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="flex flex-row justify-between items-center bg-[#1B1B1F] h-12 rounded-b-xl -mt-3 w-full p-4 text-white ">
              <div>Select Dates</div>
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden peer"
                  onChange={() => {
                    setPdates(!pDates);
                  }}
                />
                <div className="w-12 h-6 bg-[#4a484d] rounded-full peer-checked:bg-violet-500 transition duration-300"></div>
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></div>
              </label>
            </div>
            {pDates && (
              <div className=" grid grid-cols-7 gap-1 text-center bg-[#1B1B1F] h-auto rounded-b-xl -mt-3 w-full p-4 text-white">
                {[...Array(31)].map((_, index) => {
                  const day = index + 1;
                  return (
                    <button
                      key={day}
                      onClick={(e) => addPdatesArray(e, day)}
                      className={` flex items-center justify-center  font-bold transition-colors ${
                        pDatesArray.includes(day)
                          ? "text-violet-500 "
                          : " text-white hover:text-slate-400"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex flex-row justify-between items-center bg-[#1B1B1F] h-12 rounded-b-xl -mt-3 w-full p-4 text-white font-bold">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setFotm(!fotm);
                }}
                className={`transition-colors ${
                  fotm === true ? "text-violet-500" : "hover:text-slate-400"
                }`}
              >
                First of the month
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setEotm(!eotm);
                }}
                className={`transition-colors ${
                  eotm === true ? "text-violet-500" : "hover:text-slate-400"
                }`}
              >
                End of the month
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mt-4 bg-[#1B1B1F] h-10 p-4 rounded-xl">
          <span className="text-white">Pomodoro</span>
          <label className="relative inline-block w-12 h-6 cursor-pointer">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={() => {
                setPomodoro(!Pomodoro);
              }}
            />
            <div className="w-12 h-6 bg-[#4a484d] rounded-full peer-checked:bg-violet-500 transition duration-300"></div>
            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></div>
          </label>
        </div>
        {Pomodoro && (
          <div className="flex items-center justify-between -mt-2 bg-[#1B1B1F] h-10 p-4 rounded-b-xl">
            <div className="text-white">Duration</div>
            <div className="text-white text-xl  ">
              <button
                className="mr-2  font-bold"
                onClick={(e) => changePomoTime(e, -25)}
              >
                -
              </button>
              <input
                className="bg-transparent w-6 outline-none"
                type="text"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d{0,2}$/.test(value)) {
                    setPomTimehrs(value);
                  }
                }}
                value={PomTimehrs}
                onBlur={() => {
                  setPomTimehrs(String(PomTimehrs).padStart(2, "0"));
                }}
              />
              <span>:</span>
              <input
                className="bg-transparent w-6 outline-none"
                type="text"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d{0,2}$/.test(value)) {
                    const numericValue = parseInt(value);
                    if (value === "") {
                      setPomTimemin(value);
                    } else if (numericValue <= 59) {
                      setPomTimemin(value);
                    } else {
                      setPomTimemin("59");
                    }
                  }
                }}
                value={PomTimemin}
                onBlur={() => {
                  setPomTimemin(String(PomTimemin).padStart(2, "0"));
                }}
              />
              <button
                className="ml-2  font-bold "
                onClick={(e) => changePomoTime(e, 25)}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={SubmitEvent}
        className="  right-0 w-full min-h-10 text-white bg-violet-500 rounded-full"
      >
        submit event
      </button>
    </form>
  );
}

export default CreateEvent;
