"use client"

const { default: SocketConnect } = require("./socket.io/socketConnect")

const Body = ({ children }) => {
    const connected = SocketConnect()
    return (
        <>
            {connected && children}
        </>
    )
}

module.exports = { Body }