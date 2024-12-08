import React, { useState } from "react";
import { useQuery } from "react-query";
import { makeRequest } from "../axios";

const Search = () => {
 
  const [search_value, setValue] = useState("");

 const { isLoading, data: datasearch = [] } = useQuery(
   ["search", search_value],
   () =>
     makeRequest
       .get("/search", {
         params: {
           value: search_value,
         },
       })
       .then((res) => res.data),
   {
     enabled: !!search_value, 
   }
 );

  

  return (
    <div className="h-full w-full flex justify-center relative">
      <div className="search absolute overflow-visible items-center top-[10%] flex flex-col p-5 md:p-8 w-full h-full md:w-[70%] md:h-[20%] rounded-2xl md:backdrop-blur-xl md:bg-gradient-to-br from-[#202024] to-[#25272b] md:shadow-[22px_22px_44px_#121214,-22px_-22px_44px_#34363c]">
        <div
          className={`search_input_div flex w-full bg-[#17171b] h-[90%] items-center p-6 ${
            datasearch.length !== 0 ? "rounded-t-2xl" : "rounded-2xl"
          }`}
        >
          <input
            type="text"
            className="search_input flex bg-[#17171b] w-full p-6 h-full text-white text-xl focus:outline-none"
            placeholder="Search..."
            value={search_value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="text-white">
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

        <div className="dropdown  flex flex-col w-full -top-[20%] h-auto rounded-b-2xl bg-[#17171b]">
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
                    className="dropdownrow  flex flex-col justify-start h-[50px] p-6 w-full rounded-b-2xl -top-3 text-white  "
                    key={entry._id}
                  >
                    <div className="info">
                      <span>{entry.name}</span>
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
