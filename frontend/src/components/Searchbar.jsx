import React, { useState } from "react";
import { useQuery } from "react-query";
import { makeRequest } from "../axios";

const Searchbar = ({ handleUserSelect, filter }) => {
  const [search_value, setValue] = useState("");

  const { isLoading, data: datasearch = [] } = useQuery(
    ["search", search_value],
    () =>
      makeRequest
        .get("/search", {
          params: {
            value: search_value,
            filter: filter, 
          },
        })
        .then((res) => res.data),
    {
      enabled: !!search_value,
    }
  );

  return (
    <div className="w-full h-full">
      <div className="search flex h-full w-full overflow-visible  ">
        <div
          className={` flex w-full bg-[#1B1B1F] justify-center p-3 py-6  items-center  ${
            datasearch.length !== 0 ? "" : "rounded-b-2xl"
          }`}
        >
          <input
            type="text"
            className="search_input flex bg-[#1B1B1F] w-full  ml-4   text-white text-lg focus:outline-none"
            placeholder="Search..."
            value={search_value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="text-white mr-3  ">
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="dropdown  flex flex-col w-full -top-[20%] h-auto rounded-b-2xl bg-[#1B1B1F]">
        {isLoading
          ? "Loading"
          : datasearch
              .filter((entry) => {
                const name = entry.name || "";
                return (
                  search_value &&
                  name.toLowerCase().startsWith(search_value.toLowerCase())
                );
              })
              .map((entry) => (
                <div
                  className="dropdownrow  flex flex-col justify-start  p-4 w-full rounded-b-2xl -top-3 text-white  "
                  key={entry._id}
                  onClick={() => handleUserSelect(entry)}
                >
                  <div className="flex flex-row gap-2">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={
                        entry && entry.profilePic
                          ? `http://localhost:8800${entry.profilePic}`
                          : "https://cdn-icons-png.flaticon.com/512/10542/10542486.png"
                      }
                      alt=""
                    />
                    <span className="text-white font-bold">{entry.name}</span>
                    <span className="text-white font-bold">{entry.surname}</span>
                  </div>
                </div>
              ))}
      </div>
    </div>
  );
};

export default Searchbar;
