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

        socket.on('disconnect', () => {
            console.log('User disconnected')
        })

        socket.on('customEvent', (data) => {
            console.log('Custom event received with data:', data)
        })
    })
}

module.exports = {
    handler
}