"use client"

import { io } from "socket.io-client"
const socket = io(process.env.NEXT_PUBLIC_SITE_URL)

const connectPromise = new Promise((resolve, reject) => {
    socket.on('connect', () => {
        resolve(socket)
    })

    socket.on('connect_error', (error) => {
        reject(error); // Handle connection errors
    })
})

export { socket, connectPromise }