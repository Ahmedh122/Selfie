import React, { useState } from "react";

const Activity = ({ activity, user, eventDaysMutation }) => {
  console.log(activity);

  const [sub, setSub] = useState(false);

  const offset = new Date().getTimezoneOffset() * -60000;
  const offsetp = parseInt(offset, 10);
  const start = new Date(activity.startDate);
  const end = new Date(activity.endDate);
  const localStartDate = new Date(start.getTime() + offsetp);
  const localEndDate = new Date(end.getTime() + offsetp);
  const startDate = new Date(localStartDate).toLocaleDateString("en-GB");
  const endDate = new Date(localEndDate).toLocaleDateString("en-GB");
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col w-full  bg-[#151518] mb-2 rounded-xl p-4 relative">
      <div className="flex flex-row gap-2 items-center w-full">
        <h1 className="text-orange-400 text-xl font-bold">Activity:</h1>
        <span className="text-white text-lg">{activity.title}</span>
      </div>
      <div className="ml-2 flex flex-row gap-2 items-center w-full">
        <h2 className="text-slate-400">started the</h2>
        <span className="text-white ">{startDate}</span>
        <h2 className="text-slate-400">at</h2>
        <span className="text-white ">{formatTime(localStartDate)}</span>
      </div>
      <div className="ml-2 flex flex-row gap-2 items-center w-full">
        <h2 className="text-slate-400">ends the</h2>
        <span className="text-white ">{endDate}</span>
        <h2 className="text-slate-400">at</h2>
        <span className="text-white ">{formatTime(localEndDate)}</span>
      </div>
      <div>
        {activity.subActivities.length !== 0 && (
          <>
            <div className="flex flex-col w-full">
              <div className="flex  flex-row items-center justify-between p-1">
                <h2 className=" font-bold text-orange-300">Subactivities</h2>
                <button
                  className="flex items-center justify-center  w-14 h-6  rounded-md bg-[#303036]"
                  onClick={(e) => {
                    e.preventDefault();
                    setSub(!sub);
                  }}
                >
                  <span className="text-white font-bold">
                    {activity.subActivities.length}
                  </span>
                </button>
              </div>

              {sub && (
                <div className="w-full  rounded-b-xl max-h-80 [#151518] px-2 overflow-y-auto">
                  {activity.subActivities.map((sub) => (
                    <div key={sub._id} className="flex flex-col">
                      <div className="flex flex-row items-center ">
                        <span className="text-white">{sub.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <button className="absolute top-2 right-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 stroke-slate-50 hover:stroke-red-400 hover:size-6 transition-all "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>

      <button className="absolute top-2 right-9">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 stroke-white hover:stroke-violet-400 hover:size-6 transition-all "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
          />
        </svg>
      </button>
      <button className="absolute top-2 right-16">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 stroke-white hover:stroke-blue-400 hover:size-6 transition-all  "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default Activity;
