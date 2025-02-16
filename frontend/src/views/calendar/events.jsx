import React, { useEffect } from "react";
import Event from "./event";
import Activity from "./Activity";
import Subactivity from "./Subactivity";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

const Events = ({ selectedDate, currentDate, eventDaysMutation }) => {
  const currentUser = useContext(AuthContext);
  const queryDate = selectedDate
    ? new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      )
    : new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        )
      );

  const offset = new Date().getTimezoneOffset() * -60000;

  useEffect(() => {
    console.log("queryDate", queryDate);
  });

  // Fetch events
  const {
    isLoading: eventsLoading,
    error: eventsError,
    data: eventsData,
  } = useQuery(["events", queryDate], () =>
    makeRequest
      .get("/events/getEvents/", {
        params: {
          date: queryDate,
          offset,
        },
      })
      .then((res) => res.data)
  );

  // Fetch activities
  const {
    isLoading: activitiesLoading,
    error: activitiesError,
    data: activitiesData,
  } = useQuery(["activities", queryDate], () =>
    makeRequest
      .get("/activities/getActivities/", {
        params: {
          date: queryDate,
          offset,
        },
      })
      .then((res) => res.data)
  );
  const {
    isLoading: subactivitiesLoading,
    error: subactivitiesError,
    data: subactivitiesData,
  } = useQuery(["subactivities", queryDate], () =>
    makeRequest
      .get("/activities/getSubActivities/", {
        params: {
          date: queryDate,
          offset,
        },
      })
      .then((res) => res.data)
  );

  const {
    isLoading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(["users"], () =>
    makeRequest.get("/users/find/").then((res) => res.data)
  );

  if (eventsLoading || subactivitiesLoading || activitiesLoading || userLoading)
    return "Loading...";
  if (eventsError || activitiesError || userError || subactivitiesError)
    return "Something went wrong!";

  // Combine and sort by createdAt
  const combinedData = [
    ...(eventsData || []),
    ...(activitiesData || []),
    ...(subactivitiesData || []),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="w-full flex flex-col ">
      <h2 className="numevents text-gray-400 text-lg md:text-xl mt-3 mb-2 z-102">
        {combinedData.length === 0
          ? "No tasks today"
          : combinedData.length === 1
          ? "1 task today"
          : `${combinedData.length} tasks today`}
      </h2>
      <div className="events w-[70%] top-80 rounded-lg
       overflow-scroll no-scrollbar">
        {combinedData.map((item) => {
          if (item.type === "activity") {
            return (
              <Activity
                activity={item}
                key={item._id}
                user={userData.find((user) => user._id === item.userId._id)}
                eventDaysMutation={eventDaysMutation}
              />
            );
          } else if (item.type === "subactivity") {
            return (
              <Subactivity
                subactivity={item}
                key={item._id}
                eventDaysMutation={eventDaysMutation}
              />
            );
          } else if (item.type === "event") {
            return (
              <Event
                event={item}
                key={item._id}
                user={userData.find((user) => user._id === item.userId._id)}
                eventDaysMutation={eventDaysMutation}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Events;
