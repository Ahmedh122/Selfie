import { useEffect, useState } from "react";
import Task from "./task";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

function Tasks({ onTaskSelect , tasks , resettimerPOMOPADRE }) {
  const { user } = useContext(AuthContext);

  function handleTaskClick(task) {
    console.log("Task clicked:", task.taskname);
    onTaskSelect(task); // invia la task selezionata al timer
  };

  function handleDelete(task) {
    makeRequest.delete('/timers/deleteTimer/'+task.taskname)
    .then((response) => {
      console.log(response);
    });
  }  

  function handleReset(task) {
    makeRequest.put("/timers/updateTimer/" + task._id, {
      donepomo: 0,
      remainingTime: task.workTime,
      mode: 1,
      workTime: task.workTime,
      shortBreakTime: task.shortBreakTime,
      longBreakTime: task.longBreakTime,
      longBreakInterval: task.longBreakInterval,
      taskname: task.taskname,
    })
      .then((response) => {
        console.log(response.data);
      })
    resettimerPOMOPADRE(task);
  }

  return (
    <div className="flex flex-col w-full h-full">
      {tasks.map((task) => (
        <Task 
          key={task._id} 
          task={task} 
          user={user} 
          clicked={handleTaskClick} 
          deletetask={handleDelete}
          resettimer={handleReset}/>
      ))}
    </div>
  );
}

export default Tasks;
