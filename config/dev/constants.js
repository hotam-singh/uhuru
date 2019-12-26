const moduleName = "test";
module.exports = {
    successCodes: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        PARTIALINFORMATION: 203,
        NORESPONSE: 204
    },
    errorCodes: {
        BADREQUEST: 400,
        UNAUTHORIZED: 401,
        PAYMENTREQUIRED: 402,
        FORBIDDEN: 403,
        NOTFOUND: 404,
        METHODNOTALLOWED: 405,
        INTERNALSERVERERROR: 500,
        NOTIMPLEMENTED: 501,
        SERVICETEMPORARILYOVERLOADED: 502,
        GATEWAYTIMEOUT: 503
    },
    successMessages: {
        APP: {
            LOEADING_MODULE: "Loading module ${moduleName}",
            LOEADING_API_ENDPOINT: "Loading API endpoint ${moduleName}"
        },
        APP_CONNECTED: "server running on http://${config.app.address}:${config.app.port}",
        DB_CONNECTED: "database ${db.name} connected successfully"
    },
    errorMessages: {
        DOMAIN_MASTER: "domain master error:  ${err.stack}",
        DATABASE_ERROR: "database error: ${err.message}",
        API_ERROR: {
            LOAD_API_ENDPOINT: "Unable to load API endpoint for ${moduleName} of ${protocol} ${error}"
        }
    }
}
