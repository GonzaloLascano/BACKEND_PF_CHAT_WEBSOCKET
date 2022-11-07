const log4js = require ('log4js')

log4js.configure({
    appenders: {
        loggerDev: {type: "console"},
        loggerWarning: {type: "file", filename: 'logs/warn.log'},
        loggerError: {type: "file", filename: 'logs/error.log'},
    },
    categories: {
        default: {appenders: ['loggerDev'], level: "all"},
        warn: {appenders: ['loggerDev','loggerWarning'], level: "warn"},
        error: {appenders: ['loggerDev','loggerError'], level: "error"} 
    } 
})

let log = log4js.getLogger()
let logWarn = log4js.getLogger('warn')
let logError = log4js.getLogger('error')

module.exports = { log, logWarn, logError }