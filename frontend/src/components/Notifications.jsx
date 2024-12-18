import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authcontext";
import { makeRequest } from "../axios";
import { useQuery } from "react-query";

function Notifications() {
  const { currentUser } = useContext(AuthContext);
  const [notif, setNotif] = useState(false);

  const { isLoading, data } = useQuery(["notifications"], () =>
    makeRequest.get("/notifications/getNotif/").then((res) => {
      console.log("notif", data);
      return res.data;
    })
  );

  return (
    <div className="relative">
      {!notif && (
        <>
          <button
            className=""
            onClick={(e) => {
              e.preventDefault();
              setNotif(!notif);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7 stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </button>
        </>
      )}
      {notif && (
        <div className="fixed top-0 right-10 z-50 flex flex-col items-end p-2">
          <div className="bg-white flex flex-col shadow-lg rounded-xl w-96">
          
            <div className="flex flex-row items-center justify-between p-3 rounded-t-xl bg-white border-b">
              <span className="text-violet-600 text-xl font-bold">
                Notifications
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setNotif(!notif);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

           
            <div className="w-full bg-white rounded-b-xl max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : (
                <div>
                  {data?.map((notif) => (
                    <div
                      key={notif._id}
                      className="w-full p-3 flex flex-row items-center border-b"
                    >
                      {notif?.type === "Friend_req" && (
                        <div className="flex flex-col w-full">
                          <div className="flex flex-row items-center gap-2">
                            <img
                              className="w-8 h-8 rounded-full"
                              src={
                                notif?.sender?.profilePic
                                  ? `http://localhost:8800${notif.sender.profilePic}`
                                  : "https://cdn-icons-png.flaticon.com/512/10542/10542486.png"
                              }
                              alt="Profile"
                            />
                            <div className="flex flex-col">
                              <span className="text-black font-bold">
                                {notif.sender.name} {notif.sender.surname}
                              </span>
                              <span className="text-gray-600 text-sm">
                                sent you a friend request
                              </span>
                            </div>
                          </div>
                          <div className="flex mt-2 gap-2">
                            <button className="flex-1 bg-gray-800 text-white py-1 px-2 rounded-lg  ">
                              Accept
                            </button>
                            <button className="flex-1 bg-gray-300 text-black py-1 px-2 rounded-lg">
                              Decline
                            </button>
                          </div>
                        </div>
                      )}
                      {notif?.type === "Pomodoro" && (<>
                      {/*segui piu o meno lo stile delle friend_req non dimenticare il sync dei pomodori degli utenti invitati*/}
                      </>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
