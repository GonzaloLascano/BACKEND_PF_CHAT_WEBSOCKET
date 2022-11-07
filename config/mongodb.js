const mongoose = require('mongoose');
const { MONGO } = require('./config.js');
const { logError, log } = require('./log.js');

const connectMong = async () => {
    try {
        await mongoose.connect(MONGO.MONGOURL)
        log.info('mongo connected successfully')
    } catch (error) {
        logError.error(error + 'trying to connect to database');
    }
}

module.exports = connectMong