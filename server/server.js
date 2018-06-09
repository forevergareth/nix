const path = require('path')
const express = require('express')
const http = require('http')
const SocketIO = require('socket.io')


//variables
const publicPath = path.join(__dirname, '../client'),
  port = process.env.port || 3000

const {
  makeMessage,makeLocationMessage
} = require('./utils/message')

const {isString} = require('./utils/validatior')
const {Users} = require('./utils/users')

//Configure     
app = express()
server = http.createServer((app))
io = SocketIO(server)

let users = new Users

//Express Middlewares
app.use(express.static(publicPath))

//Sockets

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    if (!isString(params.name) || !isString(params.room)) {
      console.log(!isString(params.name) || !isString(params.room))
      return callback('Display Name and Room name Are Required')
    }
    socket.join(params.room)
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room)

    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    socket.emit('newMessage', makeMessage('Admin', `Welcome to the ${params.room} room.`))
    socket.broadcast.to(params.room).emit('newMessage', makeMessage('Admin', `${params.name} has joined`))
    
    callback()    
  })

  
  // socket.emit('updateUserList', function (users) {
  //   return users
  // })

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id)
    if (user && isString(message.text)) {
      io.to(user.room).emit('newMessage', makeMessage(user.name, message.text)) //Send message to all users 
    }
    callback() // Acknowledge message and notify client

    
  }) // Create message event close

  socket.on('createLocationMessage', (data) => {
    let user = users.getUser(socket.id)
    if(user)
      io.to(user.room).emit('newLocationMessage', makeLocationMessage(user.name, data.latitude,data.longitude))
  })// Create Location Message Event Handler

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id)
    console.log(users)
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', makeMessage('Admin', `${user.name} has left`))
    }
    
  }) // Disconnected event close

}) //Connection Event Close

//Routes


server.listen(port, () => {
  console.log(`Started on Port: ${port}`)
})