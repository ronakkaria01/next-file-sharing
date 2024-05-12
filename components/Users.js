import { useEffect, useState } from "react"
import { socket } from "./socket.io/connection"

export const Users = ({ passSocketId }) => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        socket.on('users', (users) => {
            setUsers(users)
        })
    }, [])

    const refreshUsers = () => {
        socket.emit('get-users')
    }

    return (
        <>
            <div>
                <button onClick={refreshUsers}>Refresh Users</button>
                {users && (
                    <ul>
                        {users.map((user, index) => (
                            <li key={index} onClick={() => passSocketId(user.socketId)}>
                                {user.username}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}