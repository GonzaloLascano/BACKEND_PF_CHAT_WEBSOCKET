const express = require('express') //se llama al modulo de express
const handlebars = require('express-handlebars')
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

/* creating DBs */

const prodTableName = 'products'
const messageTableName = 'messages'

knex.schema
  .createTable(prodTableName, (table) => {
    table.increments('id', 10)
    table.string('title', 200)
    table.integer('price', 5)
    table.string('thumbnail', 300)
  })
  .then(() => console.log('products table created'))
  .catch((err) => console.log(err))
  .finally(() => {
    knex.destroy()
  })

  liteKnex.schema
  .createTable(messageTableName, (table) => {
    table.increments('id', 10)
    table.string('user', 200)
    table.string('date', 100)
    table.string('content', 300)
  })
  .then(() => console.log('messages table created'))
  .catch((err) => console.log(err))
  .finally(() => {
    knex.destroy()
  })

/* constantes y funciones de almacenamiento en DB*/
//creating DBs

let messages = []
let products = []

/* adds requested product to db table */
async function productToDb(product) {
   await knex(prodTableName).insert(product)
   .then(() => {
     console.log('data added')
   })
   .catch((err) => {
     console.log(err)
     throw err
   })
   .finally(
     knex.destroy()
   )
}

/* loads products form db */
async function dbLoadProds() {
  await knex.from(prodTableName).select('*')
  .then((rows) => {
    products = [...rows]
  })
  .catch((err) => {
    console.log(err)
  })
  .finally(
    knex.destroy()
  )
}

function messageToDB(message) {
  liteKnex(messageTableName).insert(message)
  .then(() => {
    console.log('message added')
  })
  .catch((err) => {
    console.log(err)
    throw err
  })
  .finally(
    knex.destroy()
  )
}

function dbLoadMessages() {
  liteKnex.from(messageTableName).select('*')
  .then((rows) => {
    messages = [...rows]
  })
  .catch((err) => {
    console.log(err)
  })
  .finally(() => {
    knex.destroy()
  })
}


/* ------------------------- */

const app = express()
const httpServer = new HttpServer(app)
const io = new IoServer(httpServer)

// Se crea el servidor, se elige el numero de puerto. Se asigna ruta a archivos estaticos
const PORT = 3000

httpServer.listen(PORT, () => console.log('SERVER ON'))
httpServer.on('error', (error) => console.log({mensaje: `hubo un error :( ${error}`}))
app.use(express.static('public'))

io.on('connection', (socket) => {
    // "connection" se ejecuta la primera vez que se abre una nueva conexión
    console.log('Usuario conectado')
    // Se imprimirá solo la primera vez que se ha abierto la conexión
    socket.emit('history', messages)
    socket.on('notification', (data)=>{
        console.log(data)
    })
    socket.on('message', (data) =>{
        messageToDB(data)  
      //messages.push(data)
        console.log(data)
        io.sockets.emit('refresh', messages)
    })
    dbLoadMessages()
    socket.emit('refresh', messages)
    
    /* product sockets------------- */
    socket.emit('refreshProds', products)
    
    socket.on('newProd', async (data) =>{
        await productToDb(data)
        //data = {...data, id: (products.length === 0 ? 1 : (products[products.length - 1].id + 1))}
        //products.push(data)
        await dbLoadProds()
        console.log(products)
        io.sockets.emit('refreshProds', products)
    })
})  