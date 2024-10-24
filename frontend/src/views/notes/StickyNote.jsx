import {useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { authContext } from "../../context/authcontext";


export default function StickyNote({ note,onClose,onDuplicate }) {
    const [allowMove, setAllowMove] = useState(false);
    const stickyNoteRef = useRef();

    const [stickyNoteName, setStickyNoteName] = useState(note.title);
    const [stickyNoteContent, setStickyNoteContent] = useState(note.content);

    const refTitle = useRef();
    const refContent = useRef();

    const [dx, setDx] = useState(note.position.x);
    const [dy, setDy] = useState(note.position.y);

    function handleMouseDown(e) {
        setAllowMove(true);
        const dimensions = stickyNoteRef.current.getBoundingClientRect();
        console.log(e.clientX);
        setDx(e.clientX - dimensions.x);
        setDy(e.clientY - dimensions.y);
    }

    function handleMouseMove(e) {
        if (allowMove) {
            // move the sticky note
            const x = e.clientX - dx;
            const y = e.clientY - dy;
            stickyNoteRef.current.style.left = x + "px";
            stickyNoteRef.current.style.top = y + "px";
        }
    }

    function handleMouseUp() {
        setAllowMove(false);
    }

    useEffect(() => {
        if (allowMove) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [allowMove]);

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
    }, [stickyNoteName, stickyNoteContent, dx, dy]);

    function updateNote() {
        makeRequest.put("/notes/updateNote/" + note._id, {
            title: stickyNoteName,
            content : stickyNoteContent,
            position : { x: dx, y: dy},
        }).then((response) => {
            console.log(response.data);
        });
    }


    return (
        <div
            className="w-72 border-3 border-gray-800 absolute top-8 left-12"
            ref={stickyNoteRef}
        >
            <div
                className="bg-blue-500 text-white p-2 flex justify-between cursor-move"
                onMouseDown={handleMouseDown}
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
            <textarea
                className="outline-none w-full p-2 h-64 resize-none border-none"
                defaultValue={stickyNoteContent}
                ref={refContent}
                onChange={handleContentChange}
                name=""
                id=""
                cols="30"
                rows="10"
            ></textarea>
        </div>
    );
}
