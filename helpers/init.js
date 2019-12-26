const fs = require("fs");
// const path = require("path");

exports.createLogsDir = (config) => {
    //const dir = path.join(__dirname, "../logs");
    if(!fs.existsSync(config.logsConfig.logsDir)) {
        fs.mkdirSync(config.logsDir);
    }
}
