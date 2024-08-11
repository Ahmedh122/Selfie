import React, { useState, useEffect } from "react";

function Timer() {

  return (
    <div className="calendar-app h-full w-full flex justify-center items-center relative">
      <style>
        {`
          .glow-on-hover {
            transition: filter 0.3s ease;
          }
          .glow-on-hover-white:hover {
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 1));
          }
          .glow-on-hover-red:hover {
            filter: drop-shadow(0 0 15px rgba(255, 0, 0, 1));
          }
          .svg-glow {
           transition: filter 0.3s ease;
          }

          button:hover .svg-glow {
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 1));
          }

          .text-glow {
            transition: text-shadow 0.3s ease, transform 0.1s ease;
          }

          .text-glow:hover {
            text-shadow: 0 0 14px rgba(255, 255, 255, 0.8);
          }
        `}
      </style>
      <div className=" container absolute flex flex-col p-5 md:p-8 w-full h-full md:w-[70%]  md:h-[85%] rounded-xl md:backdrop-blur-xl md:bg-gradient-to-br from-[#202024] to-[#25272b] md:shadow-[22px_22px_44px_#121214,-22px_-22px_44px_#34363c] overflow-hidden items-center justify-center">

        {/* titolo */}
        <h1 class="text-2xl text-white font-bold md:mt-12 md:text-4xl">pomodoro</h1>

        {/* navbar  */}
        <nav class="z-10 mt-14">
          <ul class="gap- flex items-center justify-center rounded-full bg-darkBlue p-2 text-xs font-bold md:text-sm">
            <li class="">
              <button class="focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 rounded-full px-4 py-3 bg-accent font-bold text-darkBlue">pomodoro</button>
            </li>
            <li class="">
              <button class="focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 rounded-full px-4 py-3 text-grayishBlue/40">short break</button>
            </li>
            <li class="">
              <button class="focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 rounded-full px-4 py-3 text-grayishBlue/40">long break</button>
            </li>
          </ul>
        </nav>

        {/* cerchio */}
        <div class="mt-11 h-72 w-72 shrink-0 rounded-full bg-clock-gradient p-4 shadow-clock-shadow md:h-[410px] md:w-[410px] md:p-5">
          <div class="isolate flex h-full w-full flex-col items-center justify-center rounded-full bg-darkBlue">
            <svg width="340" height="340" viewBox="0 0 340 340" class="absolute -z-10 -rotate-90 scale-[72%] text-accent md:scale-[107%]">
              <circle r="154" cx="170" cy="170" fill="transparent" stroke="transparent" stroke-width="12px"></circle>
              <circle r="154" cx="170" cy="170" fill="transparent" stroke="currentColor" stroke-linecap="round" stroke-width="13px" stroke-dasharray="968" stroke-dashoffset="968"></circle>
            </svg>
            <div class="glow-on-hover w-full text-center text-5xl font-bold md:text-7xl">25:00
            </div>
            <button class="focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 mt-5 rounded-full pl-3 text-sm font-bold uppercase tracking-[0.8rem] hover:text-accent md:tracking-[0.9rem]">start</button>
          </div>
        </div>

        {/* impostazioni */}
        <div class="mt-14">
          <button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r0:" data-state="closed">
            <img src="" alt="">
            </img>
          </button>
        </div>
      </div>
    </div>

  );
}

export default Timer;
