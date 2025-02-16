import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext";
import { makeRequest } from "../axios";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import io from "socket.io-client";



const socket = io("http://localhost:8800", {
  transports: ["websocket"],
});



const DeleteIcon = ({ className, onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-6 h-6"}
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

function Notifications() {
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);
  const [isnotif, setIsNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await makeRequest.get("/notifications/getNotif/");
    setNotifications(res.data);
    return res.data;
  };



  const { isLoading } = useQuery(["notifications"], fetchNotifications);

  useEffect(() => {
    if (currentUser) {
      socket.emit("join", currentUser._id); 

      const handleNotification = () => {
        queryClient.invalidateQueries(["notifications"]); 
      };

      socket.on("notification", handleNotification);

      
      return () => {
        socket.off("notification", handleNotification);
      };
    }

    return () => {}; 
  }, [currentUser, queryClient]);

  const friendReq = useMutation(
    (userId) => {
      return makeRequest.post("friends/" + userId).then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
    }
  );

  const getShortTimeAgo = (date) => {
    const diff = moment().diff(moment(date), "seconds");
    if (diff < 60) return `${diff}s`; 
    if (diff < 3600) return `${Math.floor(diff / 60)}m`; 
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`; 
    return `${Math.floor(diff / 86400)}d`; 
  };

  const acceptActivity = useMutation(
    ({ activityId, subActivityId, userId, status }) => {
      
      return makeRequest.put(
        `/activities/${activityId}/subactivities/${subActivityId}/participants/${userId}/`,
        { status: status }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        queryClient.invalidateQueries(["events"]);
        queryClient.invalidateQueries(["activities"]);
        queryClient.invalidateQueries(["subactivities"]); 
      },
    }
  );

  const deleteNotif = useMutation(
    ({ id }) => {
      return makeRequest.delete(`/notifications/deleteNotif/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
    }
  );

  return (
    <div className="relative">
      {!isnotif && (
        <>
          <button
            className=""
            onClick={(e) => {
              e.preventDefault();
              setIsNotif(!isnotif);
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
      {isnotif && (
        <div className="fixed top-0 right-10 z-50 flex flex-col items-end p-2">
          <div className="bg-white flex flex-col shadow-lg rounded-xl w-96">
            <div className="flex flex-row items-center justify-between p-3 rounded-t-xl bg-white border-b">
              <span className="text-violet-600 text-xl font-bold">
                Notifications
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsNotif(!isnotif);
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
                  {notifications
                    ?.sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((notif) => (
                      <div
                        key={notif._id}
                        className="w-full p-3 flex flex-row items-center border-b"
                      >
                        {notif?.type === "Friend_req" && (
                          <div className="flex flex-col w-full relative">
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
                              <div className="flex flex-col ">
                                <span className="text-black font-bold">
                                  {notif.sender.name} {notif.sender.surname}
                                </span>
                                <span className="text-gray-600 text-sm">
                                  sent you a friend request
                                </span>
                              </div>
                              <span className="absolute -top-2 right-1 text-sm text-gray-500">
                                {getShortTimeAgo(notif.createdAt)}
                              </span>
                            </div>
                            <div className="flex mt-2 gap-2">
                              <button
                                className="flex-1 bg-gray-800 text-white py-1 px-2 rounded-lg  "
                                onClick={(e) => {
                                  e.preventDefault();
                                  friendReq.mutate(notif.sender._id);
                                }}
                              >
                                Accept
                              </button>
                              <button
                                className="flex-1 bg-gray-300 text-black py-1 px-2 rounded-lg"
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteNotif.mutate({ id: notif._id });
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        )}
                        {notif?.type === "Pomodoro" && (
                          <>
                            {/*segui piu o meno lo stile delle friend_req non dimenticare il sync dei pomodori degli utenti invitati*/}
                          </>
                        )}
                        {notif?.type === "You_accepted_a_friend_req" && (
                          <>
                            <div className="flex flex-col w-full relative">
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
                                    you are now friends
                                  </span>
                                </div>
                              </div>
                              <button
                                className="absolute -top-2 right-0 text-sm text-gray-500"
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteNotif.mutate({ id: notif._id });
                                }}
                              >
                                <DeleteIcon />
                              </button>
                              <span className="absolute -bottom-2 right-2 text-sm text-gray-500">
                                {getShortTimeAgo(notif.createdAt)}
                              </span>
                            </div>
                          </>
                        )}
                        {notif?.type === "friend_req_accepted" && (
                          <>
                            <div className="flex flex-col w-full relative">
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
                                    accepted your friend request
                                  </span>
                                </div>
                                <button
                                  className="absolute -top-2 right-0 text-sm text-gray-500"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    deleteNotif.mutate({ id: notif._id });
                                  }}
                                >
                                  <DeleteIcon />
                                </button>
                                <span className="absolute -bottom-2 right-2 text-sm text-gray-500">
                                  {getShortTimeAgo(notif.createdAt)}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        {notif?.type === "activity_invit" && (
                          <div className="flex flex-col w-full relative">
                            <div className="flex flex-row items-center gap-2 relative">
                              <img
                                className="w-8 h-8 rounded-full"
                                src={
                                  notif?.sender?.profilePic
                                    ? `http://localhost:8800${notif.sender.profilePic}`
                                    : "https://cdn-icons-png.flaticon.com/512/10542/10542486.png"
                                }
                                alt="Profile"
                              />
                              <div className="flex flex-col  ">
                                <span className="text-black font-bold">
                                  {notif.sender.name} {notif.sender.surname}
                                </span>
                                <span className="text-gray-600 text-sm">
                                  invited you to partecipate to an activity
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                  <span>{notif.additionalData.title}</span>
                                  
                                </div>
                                <span className="absolute -bottom-2 right-2 text-sm text-gray-500">
                                  {getShortTimeAgo(notif.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex mt-2 gap-2">
                              <button
                                className="flex-1 bg-gray-800 text-white py-1 px-2 rounded-lg  "
                                onClick={(e) => {
                                  e.preventDefault();
                                  acceptActivity.mutate({
                                    activityId: notif.additionalData.activityId,
                                    subActivityId:
                                      "",
                                    userId: currentUser._id,
                                    status: "accepted",
                                  });
                                }}
                              >
                                Accept
                              </button>
                              <button
                                className="flex-1 bg-gray-300 text-black py-1 px-2 rounded-lg"
                                onClick={(e) => {
                                  e.preventDefault();
                                  acceptActivity.mutate({
                                    activityId: notif.additionalData.activityId,
                                    subActivityId:
                                      notif.additionalData.subactivityId,
                                    userId: currentUser._id,
                                    status: "rejected",
                                  });
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        )}
                        {notif?.type === "subactivity_invit" && (
                          <div className="flex flex-col w-full relative">
                            <div className="flex flex-row items-center gap-2 relative">
                              <img
                                className="w-8 h-8 rounded-full"
                                src={
                                  notif?.sender?.profilePic
                                    ? `http://localhost:8800${notif.sender.profilePic}`
                                    : "https://cdn-icons-png.flaticon.com/512/10542/10542486.png"
                                }
                                alt="Profile"
                              />
                              <div className="flex flex-col  ">
                                <span className="text-black font-bold">
                                  {notif.sender.name} {notif.sender.surname}
                                </span>
                                <span className="text-gray-600 text-sm">
                                  invited you to partecipate to an activity
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                  <span>{notif.additionalData.title}</span>
                                  <span className="text-gray-600 text-sm">
                                    of
                                  </span>
                                  <span>
                                    {notif.additionalData.subactivityOf}
                                  </span>
                                </div>
                                <span className="absolute -bottom-2 right-2 text-sm text-gray-500">
                                  {getShortTimeAgo(notif.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex mt-2 gap-2">
                              <button
                                className="flex-1 bg-gray-800 text-white py-1 px-2 rounded-lg  "
                                onClick={(e) => {
                                  e.preventDefault();
                                  acceptActivity.mutate({
                                    activityId: notif.additionalData.activityId,
                                    subActivityId:
                                      notif.additionalData.subactivityId,
                                    userId: currentUser._id,
                                    status: "accepted",
                                  });
                                }}
                              >
                                Accept
                              </button>
                              <button
                                className="flex-1 bg-gray-300 text-black py-1 px-2 rounded-lg"
                                onClick={(e) => {
                                  e.preventDefault();
                                  acceptActivity.mutate({
                                    activityId: notif.additionalData.activityId,
                                    subActivityId:
                                      notif.additionalData.subactivityId,
                                    userId: currentUser._id,
                                    status: "rejected",
                                  });
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        )}
                        {notif?.type === "acc_subactivity_invit" && (
                          <div className="flex flex-col w-full relative">
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
                              <div className="flex flex-col ">
                                <span className="text-black font-bold">
                                  {notif.sender.name} {notif.sender.surname}
                                </span>
                                <span className="text-gray-600 text-sm">
                                  accepted to partecipate in the subactivity
                                </span>
                                <div className="flex flex-row gap-2 items-center">
                                  <span>{notif.additionalData.title}</span>
                                  <span className="text-gray-600 text-sm">
                                    of
                                  </span>
                                  <span>
                                    {notif.additionalData.subactivityOf}
                                  </span>
                                </div>
                              </div>
                              <button
                                className="absolute -top-2 right-0 text-sm text-gray-500"
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteNotif.mutate({ id: notif._id });
                                }}
                              >
                                <DeleteIcon />
                              </button>
                              <span className="absolute -bottom-2 right-2 text-sm text-gray-500">
                                {getShortTimeAgo(notif.createdAt)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  {notifications.length === 0 && (
                    <>
                    <div className="flex items-center  h-14">
                      <span className="ml-4 mb-2 text-slate-500">
                        you have no notifications...
                      </span>
                      </div>
                    </>
                  )}
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
