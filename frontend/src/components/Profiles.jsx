import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../axios";

const Profiles = () => {
  const queryClient = useQueryClient();
  const userId = useLocation().pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);

  const addFriend = useMutation(
    () => {
      return makeRequest
        .post("/notifications/sendNotif/" + userId, {type: "Friend_req"})
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["usersprofile", userId]);
      },
    }
  );

  useEffect(() => {
    queryClient.invalidateQueries(["usersprofile", userId]);
  }, [userId, queryClient]);

  const { isLoading, data } = useQuery(["usersprofile", userId], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="container absolute flex w-full h-full md:w-[70%] md:h-[85%] rounded-xl md:backdrop-blur-xl md:bg-gradient-to-br from-[#202024] to-[#25272b] md:shadow-[22px_22px_44px_#121214,-22px_-22px_44px_#34363c] overflow-hidden">
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            <img
              className="bg-violet-700 w-full rounded-t-xl h-[18rem] object-cover"
              src={
                data && data.coverPic
                  ? `http://localhost:8800${data.coverPic}`
                  : "https://flowbite.com/docs/images/examples/image-3@2x.jpg"
              }
              alt=""
            />
            <img
              className="flex top-48 left-16 absolute w-[12rem] h-[12rem] rounded-full"
              src={
                data && data.profilePic
                  ? `http://localhost:8800${data.profilePic}`
                  : "https://cdn-icons-png.flaticon.com/512/10542/10542486.png"
              }
              alt=""
            />

            <div className="absolute flex flex-row top-80 left-72">
              <span className="mr-4 text-white text-3xl font-bold">
                {data.name}
              </span>
              <span className="mr-6 text-white text-3xl font-bold">
                {data.surname}
              </span>
            </div>
            {data._id !== currentUser._id && (
              <>
                <button
                  className="absolute right-14 top-[19.5rem] flex gap-2 bg-violet-600 rounded-xl p-2  items-center "
                  onClick={(e) => {
                    e.preventDefault();
                    addFriend.mutate();
                  }}
                >
                  {data.friendshipState === "Not_friends" && (
                    <>
                      <span className="text-white text-lg">Add friend</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 stroke-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                        />
                      </svg>
                    </>
                  )}
                  {data.friendshipState === "Pending" && (
                    <>
                      <span className="text-white text-lg">Requested</span>

                    </>
                  )}
                </button>
              </>
            )}
            <div
              className="absolute right-6 top-80"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8 stroke-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profiles;
