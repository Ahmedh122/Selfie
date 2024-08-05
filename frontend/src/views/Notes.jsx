import React from "react";

const Notes = () => {
  return (
    <div>
      <svg width="200" height="200" viewBox="-100 -100 200 200">
        <g stroke="black" stroke-width="2">
          <path
            d="
        M -60 50
        L -60 50
        L 60 50
        L 60 50
        Q 50 30 50 0
        C 50 -40 -50 -40 -50 0
        Q -50 30 -60 50
       "
            fill="black"
          />
        </g>
      </svg>
    </div>
  );
};

export default Notes;
