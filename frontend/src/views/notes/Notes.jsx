import { useState } from "react"
import StickyNote from "./StickyNote"

function Notes() {
    const [notes, setNotes] = useState([])
    function addNote() {
        setNotes([
            ...notes,
            {
                id: Date.now(),
            },
        ])
    }
    function removeNote(noteId) {
        setNotes(notes.filter((item) => item.id !== noteId))
    }
    return (
        <div>
            <button class="p-2 bg-blue-500 text-white rounded-lg cursor-pointer border-none hover:bg-blue-400" onClick={addNote}>
                Create Note +
            </button>
            {notes.map((item) => (
                <StickyNote key={item.id} onClose={() => removeNote(item.id)} />
            ))}
        </div>
    )
}

export default Notes;
