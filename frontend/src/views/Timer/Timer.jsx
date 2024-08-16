import React, { useState, useEffect } from "react";

function Timer() {
  const [minutes, setMinutes] = useState("00");
  const [secs, setSecs] = useState("00");
  const [intervalId, setIntervalId] = useState(null);
  let seconds = 0;
  const [memseconds, setMemseconds] = useState(0);

  const [numberpomodoro, setNumberpomodoro] = useState(0); //number of pomodoro done

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
    if (seconds === 5) { //25 minutes = 1500 seconds
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
    seconds = memseconds;
    const id = setInterval(() => {
      seconds++;
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
    setNumberpomodoro(numberpomodoro + 1);
    pause();
    seconds = 0;
    setMemseconds(0);
    update();
  }

  return (
    <div class="bg-gray-100 flex items-center 
             justify-center h-screen">
      <div class={`rounded-lg shadow-lg p-20 ${intervalId ? 'bg-red-400' : 'bg-white'}`}>
        <h1 class="text-3xl font-bold mb-2 text-center">
          Timer
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