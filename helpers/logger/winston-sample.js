const winston = require("winston");
const format = winston.format;
const transports = winston.transports;
// const path = require("path");

const config = {
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
};

winston.addColors(config.colors);

module.exports = (appConfig) => {
    //const Logger = (config) => {
        const dynamicContent = (info, opts) => {
            const randomStr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 25);
            info.message = '[ ' + randomStr + ' ] ' + info.message;
            return info;
        }

        const logger = winston.createLogger({
            level: config.levels,
            level: "info",
            format: format.combine(
                format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss"
                }),
                winston.format(dynamicContent)(),
                format.printf(info => {
                    // print custom log message
                    return `${info.level}: [ ${info.timestamp} ] ${info.message}`
                })
                //format.errors({ stack: true })
            ),
            transports: [
                //new transports.File({ filename: appConfig.logsDir + "/info.log", level: config.levels.info }),
                new transports.File({ filename: appConfig.logsDir + "/info.log" }),
                new transports.File({ filename: appConfig.logsDir + "/errors.log", level: config.levels.error })
            ]
        });

        // add console logger if running in develepment mode
        if (process.env.ENV === "dev") {
            logger.add(
                new transports.Console({
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
    //}
}
