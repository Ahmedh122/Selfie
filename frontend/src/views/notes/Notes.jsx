import { useEffect, useState } from "react"
import StickyNote from "./StickyNote"
import { makeRequest } from "../../axios";



function Notes() {

    const [addnoteToggle, setAddnoteToggle] = useState(false);  // to trigger useEffect to fetch notes when a new note is added

    const [notes, setNotes] = useState([]);

    function getNotes() {
        makeRequest.get("/notes/getNotes").then((response) => {
            //console.log(response.data)
            setNotes(response.data)
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
        makeRequest.delete('/notes/deleteNote/' + noteId)
        .then((response) => {
            setAddnoteToggle(!addnoteToggle)
        })
    }

    function duplicateNote(noteId) { 
        makeRequest.post('/notes/duplicateNote/' + noteId)
        .then((response) => {
            setAddnoteToggle(!addnoteToggle)
        })
    }

    function getnotesafterupdate() {
        setAddnoteToggle(!addnoteToggle)
    }

    useEffect(() => {
        getNotes(); 
    }, [addnoteToggle]);


    return (
        <div>
            <button className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer border-none hover:bg-blue-400" onClick={addNote}>
                Create Note +
            </button>
            {notes.map((note) => (
                <StickyNote
                    key={note._id}  //aggiungendo sta cosa la cancellazione delle note funziona bene anche da subito ma perche???????? non ha senso 
                    note={note}
                    onClose={removeNote}
                    onDuplicate={duplicateNote}
                    onUpdate={getnotesafterupdate}
                />
            ))}
        </div>
    )
}

export default Notes;
