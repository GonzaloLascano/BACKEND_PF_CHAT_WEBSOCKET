require('dotenv').config();
const express = require('express')
const {SERVER} = require('./config/config')
const { Server: HttpServer } = require('http')
const { Server: IoServer} = require('socket.io')
const connectMong = require('./config/mongodb')
const { messageHandler } = require('./services/messageService')
const { logError, log, logWarn } = require('./config/log');

/* ----------- SERVER -------------- */

const app = express()
const httpServer = new HttpServer(app)
const io = new IoServer(httpServer) //Webockets Instance

// Server set and running

httpServer.listen(SERVER.PORT, async () => {
  await connectMong();
  log.info('SERVER RUNNING ON PORT', SERVER.PORT)
})
httpServer.on('error', (error) => logError.error(`hubo un error`, error))
app.use('/', express.static(__dirname + '/public'))

//sockets----------------

io.on('connection', async (socket) => {

  log.info('User online!')
  
  socket.on('assistMe', async (data) => {
    let messageHistory = await messageHandler(data)
    messageHistory.error ? socket.emit('warning', messageHistory) :
    socket.emit('refresh', messageHistory) 
  })

  socket.on('message', async (data) =>{
    let message = await messageHandler(data);
    message.error ? socket.emit('warning', message) :
    socket.emit('refresh', message) 
  })
})  
