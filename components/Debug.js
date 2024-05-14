export const Debug = ({ peerConnection, dataChannel }) => {

    const checkStatus = async () => {
        if (!peerConnection) return

        console.log(dataChannel)
        console.log(peerConnection)

        peerConnection.onconnectionstatechange = (event) => {
            console.log('Connection state changed:', peerConnection.connectionState)
        }
    }

    const sendHi = async () => {
        if (!peerConnection) return
        if (!dataChannel) return

        dataChannel.send("Hi Peer")
    }

    return (
        <>
            <button onClick={checkStatus}>Check Status</button>
            <button onClick={sendHi}>Send Hi</button>
        </>
    )
}