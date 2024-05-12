"use client"
import { useContext, useRef } from "react"
import { socket } from "./socket.io/connection"
import { UsernameContext } from "@/context/UsernameContext"

export const Username = () => {
    const usernameRef = useRef()
    const { setUsername } = useContext(UsernameContext)

    const submitUsername = () => {
        const username = usernameRef.current.value
        console.log(username)

        if (username != '') {
            socket.emit('add-username', username)
            setUsername(username)
        }
    }

    return (
        <div>
            <input ref={usernameRef} name="username" placeholder="Enter Username" />
            <button onClick={submitUsername}>Submit</button>
        </div>
    )
}