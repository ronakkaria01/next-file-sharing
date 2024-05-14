import { useRef } from "react"
import { socket } from "./socket.io/connection"

export const SendOffer = ({ username, peerConnection }) => {
    const targetSocketRef = useRef("")

    const sendOffer = async () => {
        if (!targetSocketRef.current.value) return
        if (!peerConnection) return
        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
        socket.emit('offer', offer, targetSocketRef.current.value)
    }

    return (
        <>
            <input type="text" placeholder="Enter target username" ref={targetSocketRef} defaultValue={username} />
            <button onClick={sendOffer}>Send Offer</button>
        </>
    )
}