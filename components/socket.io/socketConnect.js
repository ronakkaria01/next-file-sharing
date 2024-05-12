"use client"
import { useEffect, useState } from "react"
import { socket, connectPromise } from "./connection"

const SocketConnect = () => {
    const [socketConnected, setSocketConnected] = useState(false)
    useEffect(() => {
        async function initialize() {
            try {
                await connectPromise
                console.log('Socket is connected:', socket.id)
                setSocketConnected(true)
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