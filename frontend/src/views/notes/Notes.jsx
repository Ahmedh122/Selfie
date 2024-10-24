import { useEffect, useState } from "react"
import StickyNote from "./StickyNote"
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { authContext } from "../../context/authcontext";


function Notes() {

    const [addnoteToggle, setAddnoteToggle] = useState(false);  // to trigger useEffect to fetch notes when a new note is added

    const [notes, setNotes] = useState([]);

    function getNotes() {
        makeRequest.get("/notes/getNotes").then((response) => {
            setNotes(response.data)
            //console.log(response.data)
        })
    }

    function addNote() {
        makeRequest.post("/notes/addNote", { 
            title: "New Note", 
            content: "Write your content here", 
            category: "General", 
            position: {x: 0, y: 0} 
        })
        .then((response) => {
            setAddnoteToggle(!addnoteToggle)
        })

    }

    function removeNote(noteId) {
        console.log(noteId)
        makeRequest.delete('/notes/deleteNote/' + noteId)
        .then((response) => {
            setAddnoteToggle(!addnoteToggle)
        })
    }

    function duplicateNote(noteId) {
       console.log("suca")    
    }

    useEffect(() => {
        getNotes();
    }, [notes]);


    return (
        <div>
            <button className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer border-none hover:bg-blue-400" onClick={addNote}>
                Create Note +
            </button>
            {notes.map((note) => (
                <StickyNote
                    note={note}
                    onClose={removeNote}
                    onDuplicate={duplicateNote}
                />
            ))}
        </div>
    )
}

export default Notes;
