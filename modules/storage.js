//const { options } = require('../options/mariaDB.js')
const { knex, liteKnex, prodTableName, messageTableName } = require('./dbConfig')

let messages = [];
let products = [];

emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})$/


/*----------------STORAGE: memory and db interaction functions --------------------*/

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
  
  
  /* ---------------------- Products: DB interaction */
  
  async function productToDb(product) {
    await knex(prodTableName).insert(product)
     .then(() => {
       console.log('data added')
     })
     .catch((err) => {
       console.log(err)
       throw err
      }
    )
  }
  
  /* loads products form db */
  async function dbLoadProds() {
    let queryProds = await knex.from(prodTableName).select('*')
      .catch((err) => {
      console.log(err)
    })
    return queryProds;
  }

  async function dbDeleteProd(id) {
    await knex(prodTableName).where({id: id}).del()
    .then(() => {
      console.log('Product Deleted!')
    })
    .catch((err) => {
      console.log(err)
      throw err
     }
   )
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
    let queryMessages = await liteKnex.from(messageTableName).select('*')
    .catch((err) => {
      console.log(err)
    })
    return queryMessages
    //console.log(messages)
  }

  async function dbEditMessage(id, newContent) {
    await liteKnex(messageTableName)
    .where({id: id})
    .update({content: newContent})
    .then(() => {
      console.log('message edited!')
    })
    .catch((err) => {
      console.log(err)
      throw err
     }
   )
  }

  module.exports = {
    formValidation,
    productToDb,
    dbLoadProds,
    messageToDB,
    dbLoadMessages,
    messages,
    products,
  }