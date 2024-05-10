"use client"

import { io } from "socket.io-client"

const socket = io(`http://localhost:${process.env.NEXT_PUBLIC_PORT}`)

const connectPromise = new Promise((resolve, reject) => {
    socket.on('connect', () => {
        resolve(socket)
    })

    socket.on('connect_error', (error) => {
        reject(error); // Handle connection errors
    })
})

export { socket, connectPromise }