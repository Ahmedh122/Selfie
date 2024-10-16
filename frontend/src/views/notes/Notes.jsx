import { useState } from "react"
import StickyNote from "./StickyNote"
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { authContext } from "../../context/authcontext";


function Notes() {


    const [notes, setNotes] = useState([])


    function addNote() {
        setNotes([
            ...notes,
            {
                id: Date.now(),
            },
        ])
        makeRequest.post("/notes/addNote", { title: "New Note", content: "Write your content here", category: "General", position: {x: 0, y: 0}})
    }
    function removeNote(noteId) {
        setNotes(notes.filter((item) => item.id !== noteId))
    }

    function duplicateNote(noteId) {
        const note = notes.find((item) => item.id === noteId)
        setNotes([
            ...notes,
            {
                id: Date.now(),
                ...note,
            },
        ])        
    }


    return (
        <div>
            <button className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer border-none hover:bg-blue-400" onClick={addNote}>
                Create Note +
            </button>
            {notes.map((item) => (
                <StickyNote key={item.id} onDuplicate={()=> duplicateNote(item.id)} onClose={() => removeNote(item.id)} />
            ))}
        </div>
    )
}

export default Notes;
