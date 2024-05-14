import { useState } from "react"

export const SendFile = ({ peerConnection, dataChannel }) => {
    const [file, setFile] = useState(null)

    const handleFileChange = (event) => {
        setFile(event.target.files[0])
    }

    const handleSendFile = async () => {
        if (!peerConnection) return
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

        const sendDataChunk = (data) => {
            if (dataChannel.readyState === 'open') {
                dataChannel.send(data)
            }
        }

        reader.readAsArrayBuffer(file)
    }

    return (
        <>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSendFile} disabled={!file}>Send File</button>
        </>
    )
}