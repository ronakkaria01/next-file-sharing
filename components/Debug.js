export const Debug = () => {

    const checkStatus = async ({ pc, dataChannel }) => {
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
        <>
            <button onClick={checkStatus}>Check Status</button>
            <button onClick={sendHi}>Send Hi</button>
        </>
    )
}