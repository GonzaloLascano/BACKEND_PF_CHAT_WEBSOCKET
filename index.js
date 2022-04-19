const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IoServer} = require('socket.io')
const { options } = require('./options/mariaDB.js')
const knex = require('knex')(options)
const liteKnex = require('knex')(
  {
    client: "sqlite3",
    connection: {filename: "./DB/ecommerce.sqlite"},
    useNullAsDefault: true
  }
)

/* --------------Creating DBs ------------------------------------*/

//creating DBs
const prodTableName = 'products'
const messageTableName = 'messages'

knex.schema
  .createTable(prodTableName, (table) => {
    table.increments('id', 10)
    table.string('title', 200)
    table.decimal('price', 5, 2)
    table.string('thumbnail', 300)
  })
  .then(() => console.log('products table created'))
  .catch((err) => console.log(err))

  liteKnex.schema
  .createTable(messageTableName, (table) => {
    table.increments('id', 10)
    table.string('user', 200)
    table.string('date', 100)
    table.string('content', 300)
  })
  .then(() => console.log('messages table created'))
  .catch((err) => console.log(err))

/*----------------STORAGE: memory and db interaction functions --------------------*/

let messages = []
let products = []
emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})$/

function formValidation(data) {
  if (data.price) {
    if (Number(data.price)) {
      data.price = Number(data.price)
      return true
    }
    else{
      return false
    }
  }
  else if (data.user) {
    if (emailRegex.test(data.user)) {
      return true
    }
    else {
      return false
    }
  }
  else {
    return true
  }
}

/*refreshes both lists at once*/
async function refreshTables(){
  await dbLoadProds()
  await dbLoadMessages()
  console.log(products)
}

/* ---------------------- Products: DB interaction */

async function productToDb(product) {
    await knex(prodTableName).insert(product)
   .then(() => {
     console.log('data added')
   })
   .catch((err) => {
     console.log(err)
     throw err
   })
}

/* loads products form db */
async function dbLoadProds() {
  products = await knex.from(prodTableName).select('*')
    .catch((err) => {
    console.log(err)
  })
}

/* --------------------------------------Messages: DB interaction */
function messageToDB(message) {
  liteKnex(messageTableName).insert(message)
  .then(() => {
    console.log('message added')
  })
  .catch((err) => {
    console.log(err)
    throw err
  })
}

async function dbLoadMessages() {
  messages = await liteKnex.from(messageTableName).select('*')
  .catch((err) => {
    console.log(err)
  })
  console.log(messages)
}


/* ----------- SERVER -------------- */

const app = express()
const httpServer = new HttpServer(app)
const io = new IoServer(httpServer) //Webockets Instance 

// Server set and running
const PORT = 3000

httpServer.listen(PORT, () => console.log('SERVER ON'))
httpServer.on('error', (error) => console.log({mensaje: `hubo un error :( ${error}`}))
app.use(express.static('public'))


//sockets----------------

io.on('connection', (socket) => {

  refreshTables()
  socket.emit('refreshProds', products)
  console.log('Usuario conectado')

// message sockets

  socket.on('message', async (data) =>{
    let warning
    let validation = formValidation(data)
    if (validation){
      messageToDB(data)
      await dbLoadMessages()
      io.sockets.emit('refresh', messages)
    }
    else {
      let warning = 'please submit a proper email address'
      socket.emit('warning', warning)
    }
  })
  socket.emit('refresh', messages)
  
// product sockets

  socket.on('newProd', async (data) =>{
    console.log(data)
    let validation = formValidation(data)
    if (validation) {
        await productToDb(data)
        await dbLoadProds()
        io.sockets.emit('refreshProds', products)
    }
    else {
      let warning = 'Price must be a number!'
      socket.emit('warning', validation)
    }
      
  })
})  