import React from "react";
import Event from "./event";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authcontext";

const  Events = ({selectedDate , currentDate}) =>{
  const currentUser = useContext(AuthContext);
  const queryDate = selectedDate
    ? new Date(selectedDate)
    : new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
 

  const {
    isLoading: eventsLoading,
    error: eventsError,
    data: eventsData,
  } = useQuery(["events", queryDate], () =>
    makeRequest
      .get(
        `/events/getEvents?userId=${currentUser._id}&date=${
          queryDate
        .toISOString()}`
      )
      .then((res) => {
        return res.data;
      })
  );



  const {
    isLoading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(["users"], () =>
    makeRequest.get("/users/find/").then((res) => {
      return res.data;
    })
  );
  const numberOfEvents = eventsData ? eventsData.length : 0;

  return (
    <div className="events w-full overflow-scroll no-scrollbar">
      <h2 className="numevents text-gray-400 text-lg md:text-xl mt-3 mb-2">
        {numberOfEvents === 0
          ? "No events today"
          : numberOfEvents === 1
          ? "1 event today"
          : `${numberOfEvents} events today`}
      </h2>
      {eventsError || userError
        ? "Something wrong!"
        : eventsLoading || userLoading
        ? "loading"
        : eventsData.map((event) => {
            const user = userData.find((user) => user._id === event.userId._id);
            return <Event event={event} key={event._id} user={user} />;
          })}
    </div>
  );
};

export default Events;
