import { useRef } from "react"
import { socket } from "./socket.io/connection"

export const SendOffer = ({ username, pc }) => {
    const targetSocketRef = useRef("")

    const sendOffer = async () => {
        if (!targetSocketRef.current.value) return
        if (!pc) return
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket.emit('offer', offer, targetSocketRef.current.value)
    }

    return (
        <>
            <input type="text" placeholder="Enter target username" ref={targetSocketRef} defaultValue={username} />
            <button onClick={sendOffer}>Send Offer</button>
        </>
    )
}