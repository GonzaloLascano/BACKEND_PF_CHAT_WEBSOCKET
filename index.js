const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IoServer} = require('socket.io')
const { formValidation, productToDb, dbLoadProds, messageToDB, dbLoadMessages } = require('./modules/storage.js')
let { products, messages } = require('./modules/storage.js')
const { fakeList } = require('./mocks')


/* ----------- SERVER -------------- */

const app = express()
const httpServer = new HttpServer(app)
const io = new IoServer(httpServer) //Webockets Instance

// Server set and running
const PORT = 3000

httpServer.listen(PORT, () => console.log('SERVER ON'))
httpServer.on('error', (error) => console.log({mensaje: `hubo un error :( ${error}`}))
app.use('/home', express.static(__dirname + '/public'))
app.use('/api/productos-test', express.static(__dirname + '/test'))


//sockets----------------

io.on('connection', async (socket) => {

  products = await dbLoadProds()
  messages = await dbLoadMessages()
  socket.emit('refreshProds', products)
  socket.emit('refresh', messages)
  socket.emit('mocks', fakeList)
  console.log('Usuario conectado')
  console.log(messages)


 // message sockets

  socket.on('message', async (data) =>{
    let warning
    let validation = formValidation(data)
    if (validation){
      messageToDB(data)
      messages = await dbLoadMessages()
      io.sockets.emit('refresh', messages)
    }
    else {
      let warning = 'please submit a proper email address'
      socket.emit('warning', warning)
    }
  })
  
  
 // product sockets

  socket.on('newProd', async (data) =>{
    //console.log(data)
    let validation = formValidation(data)
    if (validation) {
        await productToDb(data)
        products = await dbLoadProds()
        io.sockets.emit('refreshProds', products)
    }
    else {
      let warning = 'Price must be a number!'
      socket.emit('warning', validation)
    }
      
  })
})  

