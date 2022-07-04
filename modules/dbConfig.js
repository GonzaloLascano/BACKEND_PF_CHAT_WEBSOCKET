const { options } = require('../options/mariaDB.js')
const knex = require('knex')(options)
const liteKnex = require('knex')(
  {
    client: "sqlite3",
    connection: {filename: './DB/ecommerce.sqlite'},
    useNullAsDefault: true
  }
)

/* --------------Creating DBs ------------------------------------*/
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
    .catch((err) => console.log(err)
)

liteKnex.schema
  .createTable(messageTableName, (table) => {
    table.increments('id', 10)
    table.string('user', 200)
    table.string('date', 100)
    table.string('content', 300)
  })
  .then(() => console.log('messages table created'))
  .catch((err) => console.log(err)
)

module.exports = { knex, liteKnex, prodTableName, messageTableName, }
