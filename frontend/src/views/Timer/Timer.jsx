import React, { useState, useEffect } from "react";
import settingico from "../../assets/icon-settings.svg";

function Timer() {

  const [workTime, setWorkTime] = useState(1500); //25 minutes = 1500 seconds
  const [shortBreakTime, setShortBreakTime] = useState(300); //5 minutes = 300 seconds
  const [longBreakTime, setLongBreakTime] = useState(900); //15 minutes = 900 seconds
  const [longBreakInterval, setLongBreakInterval] = useState(3); //4 pomodoro = 1 long break
  const [minutes, setMinutes] = useState(Math.floor((workTime % 3600) / 60).toString().padStart(2, '0'));
  const [secs, setSecs] = useState((workTime % 60).toString().padStart(2, '0'));
  const [intervalId, setIntervalId] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  let seconds = workTime;
  const [brek, setBrek] = useState(longBreakInterval);

  const [numberpomodoro, setNumberpomodoro] = useState(0); //number of pomodoro done
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
    if (mode == 1) {seconds = workTime;}
    if (mode == 2) {seconds = shortBreakTime;}
    if (mode == 3) {seconds = longBreakTime;}
    const id = setInterval(() => {
      seconds--;
      //setMemseconds(seconds);
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

    switch (mode) {
      case 1:
        setNumberpomodoro(numberpomodoro + 1);
        if (brek > 0) {
          setMode(mode + 1);
          setBrek(brek - 1)
        }
        else{
          setMode(3);
        }
        break;
      case 2:
        setMode(1);
        break;
      case 3:
        setMode(1);
        setBrek(longBreakInterval)
        break;
      default:
        setMode(1);
    }
    //if (mode == 1) {seconds = work;}
    //if (mode == 2) {seconds = shortBreak;}
    //if (mode == 3) {seconds = longBreak;}
    //console.log("seconds=",seconds);
    //setMemseconds(seconds);
    //update();
  }

  useEffect(() => {
    pause();
    if (mode == 1) {seconds = workTime;}
    if (mode == 2) {seconds = shortBreakTime;}
    if (mode == 3) {seconds = longBreakTime;}
    //setMemseconds(seconds);
    update();
  }, [mode,workTime, shortBreakTime, longBreakTime, longBreakInterval]); 

  function togglePopup(){
    setPopupVisible(!isPopupVisible);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    togglePopup();
  };


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
          <h6>#{numberpomodoro} ## {longBreakInterval}</h6>
        </div>
        <div class="flex justify-center space-x-4 mt-8">
          <h6><button class="bg-black" onClick={togglePopup}><img src={settingico} alt="" /></button></h6>
        </div>
      </div>
      {isPopupVisible && (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
          <div className="rounded-lg shadow-lg p-20 bg-white">
            <h1 className="text-3xl font-bold mb-2 text-center">Settings</h1>
            <div className="flex justify-center space-x-4 mt-8">
              <form onSubmit={handleSubmit}>
                <div className="flex justify-center space-x-4 mt-8">
                  <label>
                    Work time:
                    <input
                      className="ml-2"
                      type="number"
                      value={workTime}
                      onChange={(e) => setWorkTime(e.target.value)}
                      min={0}
                    />
                  </label>
                </div>
                <div className="flex justify-center space-x-4 mt-8">
                  <label>
                    Short break time:
                    <input
                      className="ml-2"
                      type="number"
                      value={shortBreakTime}
                      onChange={(e) => setShortBreakTime(e.target.value)}
                      min={0}
                    />
                  </label>
                </div>
                <div className="flex justify-center space-x-4 mt-8">
                  <label>
                    Long break time:
                    <input
                      className="ml-2"
                      type="number"
                      value={longBreakTime}
                      onChange={(e) => setLongBreakTime(e.target.value)}
                      min={0}
                    />
                  </label>
                </div>
                <div className="flex justify-center space-x-4 mt-8">
                  <label>
                    Long break interval:
                    <input
                      className="ml-2"
                      type="number"
                      value={longBreakInterval}
                      onChange={(e) => [setLongBreakInterval(e.target.value), setBrek(e.target.value)]}
                      min={0}
                    />
                  </label>
                </div>
                <div className="flex justify-center space-x-4 mt-8">
                  <label>
                    Total study time:
                    <input
                      className="ml-2"
                      type="number"
                      value={workTime*longBreakInterval}
                      onChange={(e) => setLongBreakInterval(Math.floor(e.target.value/workTime))}
                      min={0}
                    />
                  </label>
                </div>
                <div className="flex justify-center space-x-4 mt-8">
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} export default Timer;