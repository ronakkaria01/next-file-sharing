"use client"
import { useEffect, useState } from "react"
import { socket, connectPromise } from "./connection"

const SocketConnect = () => {
    const [socketConnected, setSocketConnected] = useState(false)
    useEffect(() => {
        async function initialize() {
            try {
                // Wait until the socket is connected
                await connectPromise
                console.log('Socket is connected:', socket.id)
                setSocketConnected(true)
                // Now you can use the socket
            } catch (error) {
                console.error('Error connecting to socket:', error)
                setSocketConnected(false)
            }
        }

        initialize()

        // Clean up function
        return () => {
            // Add any cleanup logic if needed
        }
    }, [])

    return socketConnected
}

export default SocketConnect