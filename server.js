const next = require('next')
const http = require('http')
const socketIO = require('socket.io')
const { handler } = require('./socketIO/handler')

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const port = process.env.PORT || 3000

app.prepare().then(() => {
    const server = http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return app.getRequestHandler()(req, res)
    })

    const io = socketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    handler(io)

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})