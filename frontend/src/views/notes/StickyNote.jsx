import {useState, useRef, useEffect } from "react";
import { makeRequest } from "../../axios";
import { marked } from "marked";


export default function StickyNote({ note,onClose,onDuplicate,onUpdate,categories }) {

    const [stickyNoteName, setStickyNoteName] = useState(note.title);
    const [stickyNoteContent, setStickyNoteContent] = useState(note.content);
    const [stickyNoteCategory, setStickyNoteCategory] = useState(note.category);
    const [Dropdown, setDropdown] = useState(false);
    const [ismarkdown, setIsmarkdown] = useState(false);

    const refTitle = useRef();
    const refContent = useRef();
    const refCategory = useRef();

    //change position
    const [position, setPositon] = useState(note.position);
    let mouseStartPos = { x: 0, y: 0 };
    const stickyNoteRef = useRef();

    const mouseDown = (e) => {
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
        console.log(mouseStartPos);
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    };

    const mouseMove = (e) => {
        //1 - Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };
        //2 - Update start position for next move.
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
        let px = stickyNoteRef.current.offsetLeft - mouseMoveDir.x
        let py = stickyNoteRef.current.offsetTop - mouseMoveDir.y

        // controllo che non sia out of bounds
        if (px < 0) {
            px = 0;
        }
        if (py < 0) {
            py = 0;
        }
        if (px > window.innerWidth - stickyNoteRef.current.offsetWidth) {
            px = window.innerWidth - stickyNoteRef.current.offsetWidth;
        }
        if (py > window.innerHeight - stickyNoteRef.current.offsetHeight) {
            py = window.innerHeight - stickyNoteRef.current.offsetHeight;
        }
        //3 - Update ntoe top and left position.
        setPositon({
            x: px,
            y: py,
        });
    };

    useEffect(() => {
        stickyNoteRef.current.style.left = position.x + "px";
        stickyNoteRef.current.style.top = position.y + "px";
    }, [position]);

    function handleNameChange(e) {
        e.preventDefault();
        setStickyNoteName(refTitle.current.value);
    }

    function handleContentChange(e) {
        e.preventDefault();
        setStickyNoteContent(refContent.current.value);
    }

    useEffect(() => {
        updateNote();
    }, [stickyNoteName, stickyNoteContent,position,stickyNoteCategory]);

    function updateNote() {
        makeRequest.put("/notes/updateNote/" + note._id, {
            title: stickyNoteName,
            content : stickyNoteContent,
            position : { x: position.x, y: position.y },
            category: stickyNoteCategory
        }).then((response) => {
            onUpdate();
        });
    }

    function toggleDropdown() {
        setDropdown(!Dropdown);
    }

    function handleCategoryChange(e) {
        e.preventDefault();
        setStickyNoteCategory(refCategory.current.value);
    }


    return (
        <div
            className="w-72 border-3 border-gray-800 absolute top-8 left-12"
            ref={stickyNoteRef}
        >
            <div
                className="bg-blue-500 text-white p-2 flex justify-between cursor-move"
                onMouseDown={mouseDown}
            >
                <div>
                <input 
                type="text"  
                className="bg-blue-500 text-white p-2 flex justify-between cursor-move"
                defaultValue={stickyNoteName}
                ref={refTitle}
                onChange={handleNameChange}
                />
                </div>
                <div
                    className="w-9 h-9 bg-red-500 rounded-full grid place-content-center bp-1 cursor-pointer hover:opacity-80"
                    onClick={() => onClose(note._id)} 
                >
                    x
                </div>
                <div
                    className="w-9 h-9 bg-green-500 rounded-full grid place-content-center bp-1 cursor-pointer hover:opacity-80"
                    onClick={() => onDuplicate(note._id)}
                >
                    +
                </div>
            </div>
            { ismarkdown ? (
                <div 
                    className="outline-none w-full p-2 h-64 resize-none border"
                    dangerouslySetInnerHTML={{ __html: marked(stickyNoteContent) }}></div>
            ) :(
            <div>
            <textarea
                className="outline-none w-full p-2 h-64 resize-none border-none"
                defaultValue={stickyNoteContent}
                ref={refContent}
                onChange={handleContentChange}
                cols="30"
                rows="10"
            ></textarea>
            </div>
            )}
            <div>
            <button
                    className="bg-blue-500 text-white p-1 mt-2 rounded"
                    onClick={() => setIsmarkdown(!ismarkdown)}
                >
                    {ismarkdown ? "Edit" : "Preview Markdown"}
                </button>
            </div>
              <div className="bg-blue-500 text-white p-2 flex justify-between">
                <span>Category: <button onClick={toggleDropdown}>{note.category}</button></span>
                {Dropdown && (
                    <div>
                        {
                            categories.map((category) => (
                                <button 
                                    className="bg-blue-500 text-white p-2 flex justify-between cursor-move"
                                    onClick={() => setStickyNoteCategory(category)}
                                >
                                    {category}
                                </button>
                            ))
                        }
                        <input 
                        type="text"  
                        className="bg-blue-400 text-white p-2 flex justify-between cursor-move"
                        defaultValue={note.category}
                        ref={refCategory}
                        onChange={handleCategoryChange}
                />

                    </div>
                    )}
            </div>
            <div className="bg-blue-500 text-white p-2 flex justify-between">
                    <p>Created: {note.creationDate}</p>
                    <p>Last Modified: {note.lastModifiedDate}</p>
                </div>
        </div>
    );
}
