import { useEffect, useState } from "react";
import Task from "./task";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

function Tasks() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  function getTasks() {
    makeRequest.get("/timers/getTimer").then((response) => {
      const taskIds = response.data[0].tasks;

      // Itera sugli ID e aggiungi solo nuovi task
      Promise.all(
        taskIds.map((taskId) =>
          makeRequest.get(`/events/getEventfromId/${taskId}`).then((res) => res.data)
        )
      ).then((newTasks) => {
        setTasks((prevTasks) => {
          const taskMap = new Map(prevTasks.map((task) => [task._id, task]));
          newTasks.forEach((task) => {
            if (!taskMap.has(task._id)) {
              taskMap.set(task._id, task);
            }
          });
          return Array.from(taskMap.values());
        });
      });
    });
  }

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  return (
    <div className="flex flex-col w-full h-full">
      {tasks.map((task) => (
        <Task key={task._id} task={task} user={user} />
      ))}
    </div>
  );
}
export default Tasks;
