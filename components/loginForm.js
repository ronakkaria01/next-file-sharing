"use client"

import { useEffect, useRef, useState } from "react";
import socket from "./socket.io/connection";

const LoginForm = () => {
    const inputRef = useRef(null)
    const [roomName, setRoomName] = useState('')

    const submit = (e) => {
        e.preventDefault()
        const name = inputRef.current.value
        console.log(name)
        setRoomName(name)
    }

    useEffect(() => {
        socket.emit('join_room', roomName)
    }, [roomName])

    return (
        <div>
            <input type="text" name="room" placeholder="Enter Room Name" ref={inputRef} />
            <button type="button" onClick={submit}>Submit</button>
            {roomName !== '' ?
                <p>
                    Room joined {roomName}
                </p> : ''
            }
        </div>
    );
};

export default LoginForm;
