const path = require("path");

module.exports = {
    app: {
        address: process.env.ADDRESS || "0.0.0.0",
        port: parseInt(process.env.PORT, 10) || 7000
    },
    db: {
        user: process.env.DB_USER || "hotam",
        password: process.env.DB_PASSWORD || "",
        host: process.env.DB_HOST || "0.0.0.0",
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || "uhuru"
    },
    cache: {},
    ssl: {
        enabled: false,
    },
    logsConfig: {
        dailyRotateFileEnable: true,
        logsDir: path.join(__dirname, "../../logs/dev"),
    },
    api: {
        users: { http: "./api/users.js" },
        payments: { http: "./api/payments.js" }
    },
    modules: {
        users: { http: "./modules/users.js" },
        payments: { http: "./modules/payments.js" }
    },
    bridgeServer: {
        url: process.env.BRIDGE_SERVER_URL,
        horizon: process.env.HORIZON
    }
}
