import {useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { authContext } from "../../context/authcontext";


export default function StickyNote({ onDuplicate,onClose }) {
    const [allowMove, setAllowMove] = useState(false);
    const stickyNoteRef = useRef();

    const [stickyNoteName, setStickyNoteName] = useState("Sticky Note");

    const refTitle = useRef();

    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);

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
                    onClick={onClose}
                >
                    x
                </div>
                <div
                    className="w-9 h-9 bg-green-500 rounded-full grid place-content-center bp-1 cursor-pointer hover:opacity-80"
                    onClick={onDuplicate}
                >
                    +
                </div>
            </div>
            <textarea
                className="outline-none w-full p-2 h-64 resize-none border-none"
                name=""
                id=""
                cols="30"
                rows="10"
            ></textarea>
        </div>
    );
}
