const winston = require("winston");
require("winston-daily-rotate-file");
const format = winston.format;
const transports = winston.transports;

let logger = module.exports = (appConfig) => {
    this.config = {
        levels: {
            error: 0,
            debug: 1,
            warn: 2,
            data: 3,
            info: 4,
            verbose: 5,
            silly: 6,
            custom: 7
        },
        colors: {
            error: 'red',
            debug: 'blue',
            warn: 'yellow',
            data: 'grey',
            info: 'green',
            verbose: 'cyan',
            silly: 'magenta',
            custom: 'yellow'
        }
    }

    winston.addColors(this.config.colors);

    const dynamicContent = (info, opts) => {
        const randomStr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 25);
        info.message = '[ ' + randomStr + ' ] ' + info.message;
        return info;
    } 
    //console.log(this.config)
    logger = winston.createLogger({
        levels: this.config.levels,
        //level: process.env.ENV === "dev" ? "debug" : "info",
        format: format.combine(
            format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss"
            }),
            winston.format(dynamicContent)(),
            format.printf(info => {
                return `${info.level}: [ ${info.timestamp} ] ${info.message}`
            })
        ),
        /* transports: [
            new transports.File({ filename: appConfig.logsConfig.logsDir + "/errors.log", level: this.config.levels.error })
        ] */
    });
    if(appConfig.logsConfig.dailyRotateFileEnable) {
        logger.add(
            new transports.DailyRotateFile({
                level: process.env.ENV === "testing" ? "debug" : "info",
                filename: appConfig.logsConfig.logsDir + "/%DATE%.log",
                datePattern: "DD-MM-YYYY",
                zippedArchived: true,
                maxFiles: "15d",
                /* format: format.combine(
                    format.colorize(),
                    format.simple(),
                    format.printf(info => {
                        // print custom log message
                        return `${info.level}: [ ${info.timestamp} ] ${info.message}`
                    })
                ) */
            })
        )

        logger.add(
            new transports.DailyRotateFile({
                level: "error",
                filename: appConfig.logsConfig.logsDir + "/application-errors-%DATE%.log",
                datePattern: "DD-MM-YYYY",
                zippedArchived: true,
                maxFiles: "15d",
            })
        )
    } else {
        logger.add(
            new transports.File({ 
                level: "info",
                filename: appConfig.logsConfig.logsDir + "/info.log"
            })
        )
    }

    //enable terminal logs
    if (process.env.ENV === "dev") {
        logger.add(
            new transports.Console({
                level: "info",
                format: format.combine(
                    format.colorize(),
                    format.simple(),
                    format.printf(info => {
                        // print custom log message
                        return `${info.level}: [ ${info.timestamp} ] ${info.message}`
                    })
                )
            })
        )
    }

    return logger;
}
