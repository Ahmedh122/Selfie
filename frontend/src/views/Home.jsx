  import React from 'react'
  import { makeRequest } from '../axios'
  import { useEffect, useState } from 'react'
  import { marked } from "marked";

  function Home() {

    const [note, setNote] = useState([]);
    const [task, setTask] = useState([]);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isloadingnote, setIsLoadingNote] = useState(true);
    const [isloadingtask, setIsLoadingTask] = useState(true);
    const [isloadingevents, setIsLoadingEvent] = useState(true);


    function getlastNote() {
      makeRequest.get("/notes/getNotes/General").
        then((response) => {
          if (response.data.length > 0) {
            setNote(response.data.sort((a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate)))
          }
          setIsLoadingNote(false)
        }
        )
    };

    function getlastTask() {
      makeRequest.get("/timers/getTimer/0").
        then((response) => {
          if (response.data.length > 0) {
            setTask(response.data.sort((a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate)))
          }
          setIsLoadingTask(false)
        }
        )
    };

    function getweekEvent() {
      makeRequest.get("/events/getEvents/")
        .then((response) => {
          console.log(response)
          if (response.data && response.data.length > 0) {
            const today = new Date();
            const endOfWeek = new Date();
            endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

            const filteredEvents = response.data.filter(event => {
              const eventEnd = new Date(event.eventEnd);
              const eventStart = new Date(event.eventStart);
              return eventEnd >= today && eventStart <= endOfWeek;
            });

            setEvents(filteredEvents.sort((a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate)));
          }
          setIsLoadingEvent(false)
        }
      )
    }


    useEffect(() => {
      getlastNote()
      getlastTask()
      getweekEvent()
      console.log(isLoading)
    }, []);

    useEffect(() => {
      setIsLoading(isloadingnote && isloadingtask && isloadingevents)
    }, [note, task, events]);

    function handleNoteclick() {
      console.log("Note clicked")
      // manda alla vista note
    }

    function handleTaskclick() {
      console.log("Task clicked")
      // manda alla vista task
    }

    function handleEventclick() {
      console.log("Event clicked")
      // manda alla vista event
      getweekEvent()
    }

    return (
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div onClick={handleNoteclick}>
              {note.length > 0 ? (
                <div className="flex-column w-72 border-3 border-gray-800 absolute top-40 left-12">
                  <div className="bg-blue-500 text-white p-2 flex justify-between">
                    <div className="bg-blue-500 text-white p-2 flex justify-between">
                      {note[0].title}
                    </div>
                  </div>
                  <div
                    className="outline-none w-full p-2 h-64 resize-none border"
                    dangerouslySetInnerHTML={{ __html: marked(note[0].content) }}></div>
                  <div>
                    <div className="bg-blue-500 text-white p-2 flex justify-between">
                      <span>Category: {note[0].category}</span>
                    </div>
                    <div className="bg-blue-500 text-white p-2 flex justify-between">
                      <p>Created: {note[0].creationDate}</p>
                      <p>Last Modified: {note[0].lastModifiedDate}</p>
                    </div>
                  </div>
                </div>
              ):(
                <div className="bg-blue-500 text-white p-2 flex justify-between">
                  <p>Non ci sono note...</p>
                </div>
              )}
            </div>
    
            <div onClick={handleTaskclick}>
              {task.length > 0 ? (
                <div className="flex flex-col w-[70%] h-min event bg-gray-600 mb-2 rounded-xl">
                  <div className="flex justify-between items-center w-full h-full ml-5 mt-2">
                    <div className="text-white font-bold text-lg">{task[0].taskname}</div>
                  </div>
                  <div className='start-date flex flex-row'>
                    <div className='ml-5 text-purple-300'>pomos done:</div>
                    <div className='flex ml-2 text-white'>{task[0].donepomo}</div>
                    <div className='ml-2 text-slate-300'>/</div>
                    <div className='ml-2 text-white'>{task[0].longBreakInterval}</div>
                  </div>
                </div>
              ):(
                <div className="bg-blue-500 text-white p-2 flex justify-between">
                  <p>Non ci sono task...</p>
                </div>
              )}
            </div>
    
            <div onClick={handleEventclick}>
              {events.length > 0 ? (
                <div>
                  <p>eventi qui</p>
                </div>
              ) : (
                <div>
                  <p>
                    <div className="bg-blue-500 text-white p-2 flex justify-between">
                      <p>Non ci sono eventi questa settimana...</p>
                    </div>
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }    


  export default Home;