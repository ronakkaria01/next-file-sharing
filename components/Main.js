"use client"

import { useContext, useEffect, useState } from "react"
import { socket } from "./socket.io/connection"
import { SendOffer } from "./SendOffer"
import { SendFile } from "./SendFile"
import { Debug } from "./Debug"
import { UsernameContext } from "@/context/UsernameContext"
import { Username } from "./Username"
import { Users } from "./Users"

const Main = () => {
    const [pc, setPc] = useState(null)
    const [dataChannel, setDataChannel] = useState(null)
    const [connected, setConnected] = useState(false)
    const { username } = useContext(UsernameContext)
    const [socketId, setSocketId] = useState('') // Meant to add to the target socket id field

    useEffect(() => {
        // Create a peer connection
        const peerConnection = new RTCPeerConnection()

        // Create a data channel
        const channel = peerConnection.createDataChannel('file-transfer')

        // Set the peer connection and data channel in state
        setPc(peerConnection)
        setDataChannel(registerChannel(channel))

        // Clean up function
        return () => {
            // Close peer connection when component unmounts
            peerConnection.close()
        }
    }, [])

    useEffect(() => {
        // Set up WebRTC signaling
        socket.on('offer', async (offer, senderSocketId) => {
            const peerConnection = new RTCPeerConnection()

            peerConnection.ondatachannel = (event) => {
                const channel = event.channel
                setDataChannel(registerChannel(channel))
            }
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('iceCandidate', event.candidate, senderSocketId)
                }
            }
            peerConnection.onconnectionstatechange = (event) => {
                console.log('Connection state changed:', peerConnection.connectionState)
                if (peerConnection.connectionState === 'connected') {
                    setConnected(true) // Set connected state to true when connection is established
                }
            }
            await peerConnection.setRemoteDescription(offer)
            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)
            socket.emit('answer', answer, senderSocketId)
        })

        socket.on('answer', async (answer) => {
            if (!pc) return
            await pc.setRemoteDescription(answer)
            setConnected(true)
        })

        socket.on('iceCandidate', async (candidate) => {
            if (!pc) return
            await pc.addIceCandidate(candidate)
        })

        // Clean up function
        return () => {
            // Remove WebRTC signaling listeners when component unmounts
            socket.off('offer')
            socket.off('answer')
            socket.off('iceCandidate')
        }
    }, [pc])

    const registerChannel = (channel) => {
        // Handle incoming data channel messages
        var receivedChunks = []
        var totalReceivedSize = 0
        var expectedFileSize = 0
        var fileName = ""

        channel.onmessage = (event) => {
            console.log(event.data)
            if (typeof event.data == "string") {
                const data = JSON.parse(event.data)
                if (data.type == 'transferstart') {
                    expectedFileSize = data.data.size
                    fileName = data.data.name
                } else if (data.type == 'transferend') {
                    if (totalReceivedSize == expectedFileSize) {
                        const reconstructedFile = new Blob(receivedChunks)
                        downloadFile(reconstructedFile, fileName)
                    } else {
                        console.log("some error occured")
                    }
                }
            } else {
                const data = new Uint8Array(event.data)
                receivedChunks.push(data)
                totalReceivedSize += data.byteLength
                console.log(data)
            }
        }

        return channel
    }

    const downloadFile = (blob, fileName) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName // Set the desired filename here
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const passSocketId = (id) => {
        setSocketId(id)
    }

    return (
        <main>
            <div>
                {socket.id ?
                    (<p>Your Socket ID {socket.id}</p>)
                    : ''
                }
                {username == '' ? (
                    <Username />
                ) : (
                    <>
                        {!connected ? (
                            <SendOffer socketId={socketId} pc={pc} />
                        ) : (
                            <>
                                <SendFile dataChannel={dataChannel} pc={pc} />
                            </>
                        )}
                        <Debug pc={pc} dataChannel={dataChannel} />

                        <Users passSocketId={passSocketId} />
                    </>
                )}
            </div>
        </main>
    )
}

export default Main