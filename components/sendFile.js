"use client"

import { useEffect, useRef, useState } from "react"
import { socket } from "../components/socket.io/connection"

const SendFile = () => {
    const [file, setFile] = useState(null)
    const [pc, setPc] = useState(null)
    const [dataChannel, setDataChannel] = useState(null)
    const [socketID, setSocketID] = useState('')
    const [connected, setConnected] = useState(false)
    const targetSocketRef = useRef("")

    const handleFileChange = (event) => {
        setFile(event.target.files[0])
    }

    const handleSendFile = async () => {
        if (!pc) return
        const reader = new FileReader()

        reader.onload = async () => {
            const chunkSize = 16 * 1024 // 16KB
            let offset = 0
            const meta = {
                type: "transferstart",
                data: {
                    size: file.size,
                    name: file.name
                }
            }
            sendDataChunk(JSON.stringify(meta))
            while (offset < file.size) {
                const chunk = reader.result.slice(offset, offset + chunkSize)
                await sendDataChunk(chunk)
                offset += chunkSize
            }
            meta.type = "transferend"
            delete meta.data
            sendDataChunk(JSON.stringify(meta))
        }

        reader.readAsArrayBuffer(file)
    }

    const sendDataChunk = (data) => {
        if (dataChannel.readyState === 'open') {
            dataChannel.send(data)
        }
    }

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
        setSocketID(socket.id)
    }, [socket])

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
            // setPc(peerConnection)
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

    const sendOffer = async () => {
        if (!targetSocketRef.current.value) return
        if (!pc) return
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket.emit('offer', offer, targetSocketRef.current.value)
    }

    const checkStatus = async () => {
        if (!pc) return

        console.log(dataChannel)
        console.log(pc)

        pc.onconnectionstatechange = (event) => {
            console.log('Connection state changed:', pc.connectionState)
        }
    }

    const sendHi = async () => {
        if (!pc) return
        if (!dataChannel) return

        dataChannel.send("Hi Peer")
    }

    return (
        <div>
            {socketID ?
                (<p>Your Socket ID {socketID}</p>)
                : ''
            }
            {!connected ? (
                <>
                    <input type="text" placeholder="Enter target socket ID" ref={targetSocketRef} />
                    <button onClick={sendOffer}>Send Offer</button>
                </>
            ) : (
                <>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleSendFile} disabled={!file}>Send File</button>
                </>
            )}

            <button onClick={checkStatus}>Check Status</button>
            <button onClick={sendHi}>Send Hi</button>
        </div>
    )
}

export default SendFile
