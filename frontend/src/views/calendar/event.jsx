import React, { useContext } from "react";

import { useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";

const Event = ({ event, user, eventDaysMutation }) => {
  const currentDate = new Date();
  const queryClient = useQueryClient();

  const navigate = useNavigate();
 
  

  const deleteMutation = useMutation(
    ({eventId, offset}) => {
      return makeRequest.delete(`/events/${eventId}/${offset}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["events"]);
        eventDaysMutation.mutate();
      },
    }
  );
  const formattedStartDate = new Date(event.eventStart).toLocaleDateString(
    "en-GB"
  );
  const formattedEndDate = new Date(event.eventEnd).toLocaleDateString("en-GB");
  const formatTimeUTC = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Usage in your component
  const startTime = formatTimeUTC(event.eventStart);
  const endTime = formatTimeUTC(event.eventEnd);

  const handleButtonClick = () => {
    addTimer();
  };

  function addTimer() {
    makeRequest
      .post("/timers/addTimer", {
        donepomo: 0,
        remainingTime: 1500,
        mode: 1,
        workTime: 1500,
        shortBreakTime: 300,
        longBreakTime: 900,
        longBreakInterval:
          (event.pomodoroHours * 60 * 60 + event.pomodoroMinutes * 60) / 1500,
        taskname: event.title,
        eventId: event._id,
      })
      .then((response) => {
        console.log(response.data);
        navigate(`/timer/${event.userId}`);
      });
  }

  const offset = new Date().getTimezoneOffset() * -60000;

  const handleDelete = () => {
  
    deleteMutation.mutate({ eventId: event._id, offset });

    if(event.pomodoro){
      makeRequest.delete("/timers/deleteTimer/" + event.title)
      .then((response) => {
        console.log(response);
      });
    }
    
  };

  return (
    <div className="flex flex-col w-full  event bg-[#151518] mb-2 rounded-xl p-4">
      <div className="flex justify-between items-center w-full h-full ml-5 mt-2">
        <div className="text-white font-bold text-lg -mt-2">{event.title}</div>
        <div>
          {event.pomodoro ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-5"
              onClick={handleButtonClick}
            >
              go to pomo
            </button>
          ) : null}
        </div>
      </div>
      <div className="start-date flex flex-row">
        <div className="ml-5 text-purple-300">Start:</div>
        <div className="flex ml-2 text-white">{formattedStartDate}</div>
        <div className="ml-2 text-slate-300">at</div>
        <div className="ml-2 text-white">{startTime}</div>
      </div>
      <div className="end-date flex flex-row">
        <div className="ml-5 text-red-300">End:</div>
        <div className="ml-3 text-white">{formattedEndDate}</div>
        <div className="ml-2 text-slate-300">at</div>
        <div className="ml-2 text-white">{endTime}</div>
      </div>
      <button className="bg-blue-600 rounded-xl w-[30%] mr-5 "
      onClick={handleDelete}> delete</button>
    </div>
  );
};

export default Event;
