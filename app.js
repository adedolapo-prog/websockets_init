const express = require("express")
const app = express()
const path = require("path")
const PORT = process.env.PORT || 4000

app.use(express.static(path.join(__dirname, "public")))

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const io = require("socket.io")(server)

io.on("connection", onConnection)
const socketsConnected = new Set()

function onConnection(socket) {
  socketsConnected.add(socket.id)
  io.emit("clients-total", socketsConnected.size)

  socket.on("disconnect", () => {
    socketsConnected.delete(socket.id)
    io.emit("clients-total", socketsConnected.size)
  })

  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data)
  })

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data)
  })
}
