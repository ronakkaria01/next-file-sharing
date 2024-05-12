const { addUser, getUsers, removeUserBySocketId } = require('../utils/helpers')

function handler(io) {
    io.on('connection', (socket) => {
        console.log('A user connected')

        socket.on('error', (error) => {
            console.error('Socket connection error:', error)
        })

        socket.on('offer', (offer, targetSocketId) => {
            io.to(targetSocketId).emit('offer', offer, socket.id)
        })

        socket.on('answer', (answer, targetSocketId) => {
            io.to(targetSocketId).emit('answer', answer)
        })

        socket.on('iceCandidate', (candidate, targetSocketId) => {
            io.to(targetSocketId).emit('iceCandidate', candidate)
        })

        socket.on('disconnect', async (e) => {
            console.log('User disconnected')

            await removeUserBySocketId(socket.id)
            socket.emit('users', getUsers())
        })

        socket.on('customEvent', (data) => {
            console.log('Custom event received with data:', data)
        })

        socket.on('add-username', async (username) => {
            const add = {
                username: username,
                socketId: socket.id
            }
            await addUser(add)
        })

        socket.on('get-users', () => {
            socket.emit('users', getUsers())
        })
    })
}

module.exports = {
    handler
}