import React, { useState, useEffect } from "react";

function Timer() {

  let work = 10; //25 minutes = 1500 seconds
  let shortBreak = 5; //5 minutes = 300 seconds
  let longBreak = 7; //15 minutes = 900 seconds
  let longBreakInterval = 4; //4 pomodoro = 4*25 minutes = 100 minutes = 6000 seconds

  const [minutes, setMinutes] = useState(Math.floor((work % 3600) / 60).toString().padStart(2, '0'));
  const [secs, setSecs] = useState((work % 60).toString().padStart(2, '0'));
  const [intervalId, setIntervalId] = useState(null);

  
  let seconds = work;
  const [memseconds, setMemseconds] = useState(work);

  const [numberpomodoro, setNumberpomodoro] = useState(1); //number of pomodoro done
  const [mode, setMode] = useState(1); //1=work, 2=short break, 3=long break

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  function update() {
    setMinutes(Math.floor((seconds % 3600) / 60).toString().padStart(2, '0'));
    setSecs((seconds % 60).toString().padStart(2, '0'));
    if (seconds === 0) { //25 minutes = 1500 seconds
      setIntervalId(null);
      reset();
    }
  }

  function toggleclick() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }
    if (mode == 1) {seconds = work;}
    if (mode == 2) {seconds = shortBreak;}
    if (mode == 3) {seconds = longBreak;}
    const id = setInterval(() => {
      seconds--;
      setMemseconds(seconds);
      update();
    }, 1000);
    setIntervalId(id);
  }

  function pause() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }

  function reset() {
    if (mode < 3) {setMode(mode+1);}
    else {setMode(1);}
    setNumberpomodoro(numberpomodoro + 1);
    //if (mode == 1) {seconds = work;}
    //if (mode == 2) {seconds = shortBreak;}
    //if (mode == 3) {seconds = longBreak;}
    //console.log("seconds=",seconds);
    //setMemseconds(seconds);
    //update();
  }

  useEffect(() => {
    pause();
    if (mode == 1) {seconds = work;}
    if (mode == 2) {seconds = shortBreak;}
    if (mode == 3) {seconds = longBreak;}
    setMemseconds(seconds);
    update();
  }, [mode]); 

  return (
    <div class="bg-gray-100 flex items-center 
             justify-center h-screen">
      <div class={`rounded-lg shadow-lg p-20 ${intervalId ? 'bg-red-400' : 'bg-white'}`}>
        <h1 class="text-3xl font-bold mb-2 text-center">
          Timer
        </h1>
        <h1 class="text-3xl font-bold mb-2 text-center">
          {mode == 1 ? 'Work' : mode == 2 ? 'Short Break' : 'Long Break'} 
        </h1>
        <div class="flex items-center justify-center 
                    bg-gray-200 rounded-lg p-4 mt-8">
          <span id="timer" class="text-4xl font-bold">
          {`${minutes}:${secs}`}
          </span>
        </div>
        <div class="flex justify-center space-x-4 mt-8">
          <button id="startBtn"
            class={`px-4 py-2 rounded text-white ${intervalId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}`} onClick={toggleclick}>{intervalId ? 'Pause' : 'Start'}
          </button>
          <button id="resetBtn"
            class="px-4 py-2 bg-red-500 text-white 
                           rounded hover:bg-red-600" onClick={reset}>Skip
          </button>
        </div>
        <div class="flex justify-center space-x-4 mt-8">
          <h6>#{numberpomodoro}</h6>

        </div>
      </div>
    </div>
  );
} export default Timer;