const { MessageMongoModel } = require('../models/messagesModel')
const { logError, log, logWarn } = require('../config/log.js');

const messageHandler = async (data) => {
    try{
        let messagedata = {...data, admin: false}
        await MessageMongoModel.create(messagedata)
        let messages = await MessageMongoModel.find({email: data.email})
        return messages
    } catch (error) {
        let caughtError = error.errors.email?.message ?? error.errors.body.message 
        let errorMessages = {error:caughtError, message: 'could not update or load messages form db'}
        logError.error(errorMessages.error)
        return errorMessages
    }
}

module.exports = { messageHandler }