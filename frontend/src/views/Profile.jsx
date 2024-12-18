import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../axios";

const Profile = () => {
   
  const queryClient = useQueryClient();
  const userId = useLocation().pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);
  const [selectedPrPic, setSelectedPrPic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [bio, setBio] = useState("");

  const mutation = useMutation(
    (formData) => {
      return makeRequest.put("/users/update", formData).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["userprofile"]);
        setEdit(false);
        setCoverPic(null);
      },
    }
  );



   

  const { isLoading, data } = useQuery(["userprofile"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  const handleCovPicChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setCoverPic(file);
  };

  const handleEdit =(e) =>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("Bio", bio);
    formData.append("BirthDay", birthday);
    formData.append("file", coverPic); // The file field
    formData.append("type", "coverPic");

    formData.append("userId", currentUser._id);

    mutation.mutate(formData)


  }

  const handlePrPicChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setSelectedPrPic(file);

    const formData = new FormData();
    formData.append("file", file); // The file field
    formData.append("type", "profilePic");
 
    formData.append("userId", currentUser._id);

    mutation.mutate(formData);
  };

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
            {data._id === currentUser._id && (
              <>
                <div className="edit_profile_pic absolute items-center justify-center w-10 h-10 rounded-full bg-violet-600 top-[21rem] left-[12.5rem]">
                  <label
                    htmlFor="profile-pic-input"
                    className="flex items-center justify-center w-full h-full cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 stroke-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </label>
                  <input
                    id="profile-pic-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePrPicChange}
                  />
                </div>
              </>
            )}
            <div className="absolute flex flex-row top-80 left-72">
              <span className="mr-4 text-white text-3xl font-bold">
                {data.name}
              </span>
              <span className="mr-6 text-white text-3xl font-bold">
                {data.surname}
              </span>
            </div>
      
            <div
              className="absolute right-6 top-80"
              onClick={(e) => {
                e.preventDefault();
                setEdit(!edit);
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
            {edit && data._id === currentUser._id && (
              <>
                <div className="backgroundpopupblur w-full h-full absolute inset-0 flex bg-black/60 backdrop-blur-[4px] rounded-none md:rounded-xl transition-transform duration-300 ease-in-out justify-center items-center">
                  <div className="relative bg-[#2C2C2E] w-[90%] sm:w-[70%] md:w-[60%] h-[90%] sm:h-[80%] rounded-xl flex flex-col items-center justify-start overflow-hidden">
                    <div className="absolute z-10 top-0 w-full bg-[#1B1B1F] rounded-t-xl p-4">
                      <div className="flex justify-between items-center">
                        <div className="text-white font-bold text-lg">
                          Edit Profile
                        </div>
                        <div
                          className="text-white cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            setEdit(!edit);
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
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <form className="flex flex-col w-full pt-72 px-20 justify-center items-center gap-6  overflow-y-auto no-scrollbar">
                      <div className="flex flex-col w-full gap-4  bg-[#1B1B1F] p-4 rounded-xl">
                        <div className="flex justify-between items-center w-full">
                          <div className="text-white font-semibold">
                            Change cover pic
                          </div>
                          <label
                            htmlFor="cover-pic-input"
                            className="flex items-center justify-center cursor-pointer"
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
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                              />
                            </svg>
                          </label>
                          <input
                            id="cover-pic-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCovPicChange}
                          />
                        </div>
                        {coverPic && (
                          <div className="relative w-full flex justify-center items-center ">
                            <img
                              src={URL.createObjectURL(coverPic)}
                              alt="Cover Pic"
                              className="w-[60%] sm:w-[50%] md:w-[40%] h-auto rounded-lg"
                            />
                            <button
                              className="bg-red-600 absolute top-2 right-2 p-2 rounded-full text-white"
                              onClick={(e) => {
                                e.preventDefault();
                                setCoverPic(null);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row w-full gap-4 items-start justify-between bg-[#1B1B1F] p-4 rounded-xl">
                        <span className="text-white font-bold">Name</span>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-[#35353b] rounded-xl text-white p-2 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-row w-full gap-4 items-start justify-between bg-[#1B1B1F] p-4 rounded-xl">
                        <span className="text-white font-bold">Surname</span>
                        <input
                          type="text"
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          className="bg-[#35353b] rounded-xl text-white p-2 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-row w-full gap-4 items-start justify-between bg-[#1B1B1F] p-4 rounded-xl">
                        <span className="text-white font-bold">Birth Day</span>
                        <input
                          type="date"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                          className="bg-[#35353b] rounded-xl text-white p-2 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-row w-full gap-4 items-start justify-between bg-[#1B1B1F] p-4 rounded-xl">
                        <textarea
                          name="Bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Bio"
                          className="p-2 rounded-xl border text-white w-full min-h-[30%]  bg-[#4a484d]  border-none focus:outline-none resize-none "
                        ></textarea>
                      </div>
                    </form>
                    <button
                      className="absolute flex bottom-3 right-2.5 bg-violet-600 w-[3rem] h-[3rem] rounded-full items-center justify-center"
                      onClick={handleEdit}
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
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
