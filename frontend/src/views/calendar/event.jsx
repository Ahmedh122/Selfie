import React, { useContext } from 'react'
import { AuthContext } from '../../context/authcontext';
import { useMutation, useQueryClient } from 'react-query';
import { makeRequest } from '../../axios';
import { useNavigate } from 'react-router-dom';


const Event = ({ event, user }) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate(); 
  const { curretUser } = useContext(AuthContext);


  const deleteMutation = useMutation(
    (eventId) => {
      return makeRequest.delete("/events/" + eventId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["events"]);
      },
    }
  );
  const formattedStartDate = new Date(event.eventStart).toLocaleDateString("en-GB");
  const formattedEndDate = new Date(event.eventEnd).toLocaleDateString(
    "en-GB"
  );
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
    console.log('aaaa');
    makeRequest.get("/timers/getTimer").then((response) => {
      //se non c'è un timer, lo creo
      if (response.data.length == 0) {
        makeRequest.post("/timers/addTimer", {
          donepomo: 0,
          remainingTime: 1500,
          mode: 1,
          workTime: 1500,
          shortBreakTime: 300,
          longBreakTime: 900,
          longBreakInterval: ((event.pomodoroHours * 60 * 60) + event.pomodoroMinutes * 60)/1500,
        })
        .then((response) => {
          console.log('post');
          navigate(`/timer/${event.userId}`);
        })
      }
      else{
        //se c'è un timer, lo aggiorno
        makeRequest.put("/timers/addTimer/" + response.data[0]._id, {
          donepomo: 0,
          remainingTime: 1500,
          mode: 1,
          workTime: 1500,
          shortBreakTime: 300,
          longBreakTime: 900,
          longBreakInterval: ((event.pomodoroHours * 60 * 60) + event.pomodoroMinutes * 60)/1500,
        })
        .then((response) => {
          console.log('put');
          navigate(`/timer/${event.userId}`);
        })
      }
    });
  }


  return (
<<<<<<< HEAD
    <div className="  flex flex-col w-[70%] h-min  pb-4 pt-2 event bg-[#141517] mb-2 rounded-xl ">
      <div className="flex text-white font-bold text-lg w-full  h-full ml-5 mt-2 ">
        {event.title}
      </div>
      <div className="start-date flex flex-row ">
        <div className="ml-5 text-purple-300">Start:</div>
        <div className="flex ml-2 text-white"> {formattedStartDate} </div>
        <div className="ml-2 text-slate-300">at</div>
        <div className="ml-2 text-white">{startTime} </div>
      </div>
      <div className="end-date flex flex-row">
        <div className=" ml-5 text-red-300 ">End:</div>
        <div className="ml-3 text-white">{formattedEndDate}</div>
        <div className="ml-2 text-slate-300">at</div>
        <div className=" ml-2 text-white">{endTime}</div>
=======
    <div className="flex flex-col w-[70%] h-min event bg-gray-600 mb-2 rounded-xl">
      <div className="flex justify-between items-center w-full h-full ml-5 mt-2">
        <div className="text-white font-bold text-lg">{event.title}</div>
        <div>
          {event.pomodoro ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-5"
              onClick={handleButtonClick}
            >go to pomo</button>
          ) : null}
        </div>
      </div>
      <div className='start-date flex flex-row'>
        <div className='ml-5 text-purple-300'>Start:</div>
        <div className='flex ml-2 text-white'>{formattedStartDate}</div>
        <div className='ml-2 text-slate-300'>at</div>
        <div className='ml-2 text-white'>{startTime}</div>
      </div>
      <div className='end-date flex flex-row'>
        <div className='ml-5 text-red-300'>End:</div>
        <div className='ml-3 text-white'>{formattedEndDate}</div>
        <div className='ml-2 text-slate-300'>at</div>
        <div className='ml-2 text-white'>{endTime}</div>
>>>>>>> cdf5c33e1131218c91b59f210df49fd0602d5fe7
      </div>
    </div>
  );
}

export default Event