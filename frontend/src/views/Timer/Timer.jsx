import React, { useState, useEffect } from "react";
import settingico from "../../assets/icon-settings.svg";
import { makeRequest } from "../../axios";

function Timer() {

  const [workTime, setWorkTime] = useState(1500); //25 minutes = 1500 seconds
  const [shortBreakTime, setShortBreakTime] = useState(300); //5 minutes = 300 seconds
  const [longBreakTime, setLongBreakTime] = useState(900); //15 minutes = 900 seconds
  const [longBreakInterval, setLongBreakInterval] = useState(3); //4 pomodoro = 1 long break
  const [TotalStudyTime, setTotalStudyTime] = useState(1500*3); // total time to study
  const [minutes, setMinutes] = useState(Math.floor((workTime % 3600) / 60).toString().padStart(2, '0'));
  const [secs, setSecs] = useState((workTime % 60).toString().padStart(2, '0'));
  const [intervalId, setIntervalId] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const [remainingtime, setRemainingTime] = useState(workTime);
  const [brek, setBrek] = useState(longBreakInterval);
  const [numberpomodoro, setNumberpomodoro] = useState(0); //number of pomodoro done
  const [mode, setMode] = useState(1); //1=work, 2=short break, 3=long break

  const [dummy, setDummy] = useState(false); 


  useEffect(() => {
    getTimer();
    console.log("getTimerz");
  }, []);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  function update() {
    setMinutes(Math.floor((remainingtime % 3600) / 60).toString().padStart(2, '0'));
    setSecs((remainingtime % 60).toString().padStart(2, '0'));
    if (remainingtime === 0) { //25 minutes = 1500 remainingtime
      setIntervalId(null);
      reset();
    }
    if(dummy){
      addTimer();
    }
    console.log(remainingtime);
  }

  function toggleclick() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }
    console.log("toggleclick");
  
    const id = setInterval(() => {
      setRemainingTime(prevRemainingTime => prevRemainingTime - 1);
    }, 1000);
    setIntervalId(id);
  }

  useEffect(() => {
      update(); 
  }, [remainingtime]);

  function pause() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }

  function reset() {
    setDummy(true);
    switch (mode) {
      case 1: //work
        setNumberpomodoro(numberpomodoro + 1);
        if (brek > 0) {
          setMode(mode + 1);
          setBrek(brek - 1);
          setRemainingTime(shortBreakTime);
        }
        else{
          setMode(3);
          setRemainingTime(longBreakTime);
        }
        break;
      case 2: //short break
        setMode(1);
        setRemainingTime(workTime);
        break;
      case 3: //long break
        setMode(1);
        setBrek(longBreakInterval)
        setRemainingTime(workTime);
        break;
      default:
        setMode(1);
        setRemainingTime(workTime);
    }
    addTimer();
  }

  useEffect(() => {
    console.log("useEffect strano"); 
    pause();
    /*if (mode == 1) {remainingtime = workTime;}
    if (mode == 2) {remainingtime = shortBreakTime;}
    if (mode == 3) {remainingtime = longBreakTime; alert("hai finito il ciclo");}*/
    update();
  }, [mode]); 

  function togglePopup(){
    setDummy(true);
    setPopupVisible(!isPopupVisible);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    togglePopup();
  };

  const worktimehandler = (e) => {
    const worktime = e.target.value * 60;
    setWorkTime(worktime);
    setTotalStudyTime(worktime * longBreakInterval);
    if ((intervalId == null) && (mode == 1)) { // se non è in esecuzione il timer aggiorno il tempo rimanente con il nuovo worktime\
      console.log("worktimehandler");
      setRemainingTime(worktime);
    }  
  };

  const shorttimehandler = (e) => {
    const shorttime = e.target.value * 60;
    setShortBreakTime(shorttime);
    if ((intervalId == null) && (mode == 2)) { // se non è in esecuzione il timer aggiorno il tempo rimanente con il nuovo worktime
      setRemainingTime(shorttime);
    }
  };

  const longtimehandler = (e) => {
    const longtime = e.target.value * 60;
    setLongBreakTime(longtime);
    if ((intervalId == null) && (mode == 3)) { // se non è in esecuzione il timer aggiorno il tempo rimanente con il nuovo worktime
      setRemainingTime(longtime);
    }
  };

  const TotalStudyTimeHandler = (e) => {
    const tottime = e.target.value * 60;
    const newLongBreakInterval = Math.floor(tottime / workTime);
    setTotalStudyTime(tottime);
    setLongBreakInterval(newLongBreakInterval);
    setBrek(newLongBreakInterval);
  };

  const longbreakintervalhandler = (e) => {
    const longbreakinterval = e.target.value;
    setLongBreakInterval(longbreakinterval);
    setTotalStudyTime(workTime * longbreakinterval);
    setBrek(longbreakinterval);
  };
  
  function getTimer() {	
    makeRequest.get("/timers/getTimer").then((response) => {
      console.log(response.data);
      if (response.data.length > 0) {
        setWorkTime(response.data[0].workTime);
        setShortBreakTime(response.data[0].shortBreakTime);
        setLongBreakTime(response.data[0].longBreakTime);
        setLongBreakInterval(response.data[0].longBreakInterval);
        setTotalStudyTime(response.data[0].workTime * response.data[0].longBreakInterval);
        setNumberpomodoro(response.data[0].donepomo);
        setMode(response.data[0].mode);
        if (response.data[0].remainingTime > 0) {
          setRemainingTime(response.data[0].remainingTime);
        }
      }

    });
    setIsLoading(false);
  }

  // post timer or put timer if already exists
  function addTimer() {
    console.log("addTimer");
    makeRequest.get("/timers/getTimer").then((response) => {
      //se non c'è un timer, lo creo
      if (response.data.length == 0) {
        makeRequest.post("/timers/addTimer", {
          donepomo: numberpomodoro,
          remainingTime: remainingtime,
          mode: mode,
          workTime: workTime,
          shortBreakTime: shortBreakTime,
          longBreakTime: longBreakTime,
          longBreakInterval: longBreakInterval,
        })
        .then((response) => {
          console.log('post');
        })
      }
      else{
        //se c'è un timer, lo aggiorno
        makeRequest.put("/timers/addTimer/" + response.data[0]._id, {
          donepomo: numberpomodoro,
          remainingTime: remainingtime,
          mode: mode,
          workTime: workTime,
          shortBreakTime: shortBreakTime,
          longBreakTime: longBreakTime,
          longBreakInterval: longBreakInterval,
        })
        .then((response) => {
          console.log('put');
        })
      }
    });
  }

  function handleSave() {
    addTimer();
  }

  return  isloading ? (<div>Loading...</div>) : (
    <div className="bg-gray-100 flex items-center 
             justify-center h-screen">
      <div className={`rounded-lg shadow-lg p-20 ${intervalId ? 'bg-red-400' : 'bg-white'}`}>
        <h1 class="text-3xl font-bold mb-2 text-center">
          Timer
        </h1>
        <h1 className="text-3xl font-bold mb-2 text-center">
          {mode == 1 ? 'Work' : mode == 2 ? 'Short Break' : 'Long Break'} 
        </h1>
        <div className="flex items-center justify-center 
                    bg-gray-200 rounded-lg p-4 mt-8">
          <span id="timer" className="text-4xl font-bold">
          {`${minutes}:${secs}`}
          </span>
        </div>
        <div className="flex justify-center space-x-4 mt-8">
          <button id="startBtn"
            className={`px-4 py-2 rounded text-white ${intervalId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}`} onClick={toggleclick}>{intervalId ? 'Pause' : 'Start'}
          </button>
          <button id="resetBtn"
            className="px-4 py-2 bg-red-500 text-white 
                           rounded hover:bg-red-600" onClick={reset}>Skip
          </button>
        </div>
        <div className="flex justify-center space-x-4 mt-8">
          <h6>#{numberpomodoro}</h6>
        </div>
        <div className="flex justify-center space-x-4 mt-8">
          <h6><button className="bg-black" onClick={togglePopup}><img src={settingico} alt="" /></button></h6>
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
                      value={workTime/60}
                      onChange={worktimehandler}
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
                      value={shortBreakTime/60}
                      onChange={shorttimehandler}
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
                      value={longBreakTime/60}
                      onChange={longtimehandler}
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
                      onChange={longbreakintervalhandler}
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
                      value={TotalStudyTime/60}
                      onChange={TotalStudyTimeHandler}
                      min={0}
                      step={workTime/60}
                    />
                  </label>
                </div>
                <div className="flex justify-center space-x-4 mt-8">
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleSave}>
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