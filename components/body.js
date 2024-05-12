"use client"
import { SocketConnect } from "./socket.io/socketConnect"

export const Body = ({ children }) => {
    const connected = SocketConnect()
    return (
        <>
            {connected && children}
        </>
    )
}