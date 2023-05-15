const express = require('express')
const dotenv = require('dotenv')
var cors = require('cors')
const connectDB = require('./config/db.js')
const userRoutes = require('./routes/userRoutes.js')
const chatRoutes = require('./routes/chatRoutes.js')
const messageRoutes = require('./routes/messageRoutes.js')
const { notFound, errorHandler } = require('./middlewear/errorhandler.js')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()
connectDB()


app.use("/api/chats", chatRoutes)
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)



// -----------------------Deployment--------------------


const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "/frontend/build")))
    app.get("*", (req, res) => {
        // res.send("Api is running Successfully")
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    })
}
else {
    app.get("/", (req, res) => {
        res.send("Api is running Successfully")
    })
}


// -----------------------Deployment--------------------



app.use(notFound)
app.use(errorHandler)

const expressserver = app.listen(process.env.PORT || 5000, () => { console.log("Backend Started at port", process.env.PORT) })

const { Server } = require('socket.io')

const io = new Server(expressserver, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on("connection", (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on('join chat', (room) => {
        socket.join(room);
    })
    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log('chat.users not defined')
        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })
    socket.on('typing', (room) => socket.in(room).emit("typing"))
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"))
    socket.off('setup', () => {
        socket.leave(userData._id)
    })
})