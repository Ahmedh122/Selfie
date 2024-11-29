import { useEffect, useState } from "react";
import Task from "./task";
import Timer from "./Timer";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

function Tasks({ onTaskSelect }) {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  function getTasks() {
    makeRequest.get("/timers/getTimer").then((response) => {
      response.data.forEach(element => {
        setTasks(prevTasks => {
          if (!prevTasks.some(t => t._id === element._id)) {
            console.log(element);
            return [...prevTasks, element];
          }
          return prevTasks;
        });
      });
    });
  }

  useEffect(() => {
    getTasks();
  }, []);

  const handleTaskClick = (task) => {
    console.log("Task clicked:", task.taskname);
    onTaskSelect(task); // Invia la task selezionata al componente genitore (Timer)
  };

  return (
    <div className="flex flex-col w-full h-full">
      {tasks.map((task) => (
        <Task key={task._id} task={task} user={user} click={() => handleTaskClick(task)} />
      ))}
    </div>
  );
}

export default Tasks;
