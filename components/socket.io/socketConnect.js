"use client"
import { useEffect, useState } from "react"
import { connectPromise } from "./connection"

export const SocketConnect = () => {
    const [socketConnected, setSocketConnected] = useState(false)
    
    useEffect(() => {
        async function initialize() {
            try {
                await connectPromise
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