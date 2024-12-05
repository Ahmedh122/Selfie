import { useEffect, useState } from "react";
import Task from "./task";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

function Tasks({ onTaskSelect , tasks , resettimerPOMOPADRE }) {
  const { user } = useContext(AuthContext);
  //const [tasks, setTasks] = useState([]);

  /*function getTasks() {
    makeRequest.get("/timers/getTimer/0").then((response) => {
      response.data.forEach(element => {
        setTasks(prevTasks => {
          if (!prevTasks.some(t => t._id === element._id)) {
            return [...prevTasks, element];
          }
          return prevTasks;
        });
      });
    });
  }*/

  /*useEffect(() => {
    getTasks();
    console.log("Tasks:", tasks);
  }, [tasks]);*/

  function handleTaskClick(task) {
    console.log("Task clicked:", task.taskname);
    onTaskSelect(task); // invia la task selezionata al timer
  };

  function handleDelete(task) {
    makeRequest.delete('/timers/deleteTimer/'+task.taskname)
    .then((response) => {
      console.log(response);
      //setTasks(prevTasks => prevTasks.filter(t => t._id !== task._id));
    });
  }  

  function handleReset(task) {
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
