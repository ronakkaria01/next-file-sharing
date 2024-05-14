"use client"
import { io } from "socket.io-client"

const socket = io(process.env.NEXT_PUBLIC_SITE_URL, {
    transports: ['websocket'],
    rejectUnauthorized: false,
    withCredentials: true,
})

const connectPromise = new Promise((resolve, reject) => {
    socket.on('connect', () => {
        resolve(socket)
    })

    socket.on('connect_error', (error) => {
        console.log(error)
        reject(error)
    })

    socket.on('error', (error) => {
        console.error('Socket error:', error)
        reject(error)
    })
})

connectPromise.then(() => {
    socket.on('users', (users) => {
        // console.log(users)
    })
})

export { socket, connectPromise }