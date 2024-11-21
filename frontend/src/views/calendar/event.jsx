import React, { useContext } from 'react'
import { AuthContext } from '../../context/authcontext';
import { useMutation, useQueryClient } from 'react-query';
import { makeRequest } from '../../axios';


  const Event = ({event, user}) => {
    const queryClient = useQueryClient();

    const {curretUser} = useContext(AuthContext);


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


  return (
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
      </div>
    </div>
  );
}

export default Event