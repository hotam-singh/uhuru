const request = require("request-promise");
var StellarSdk = require('stellar-sdk');


let library;

function Payments(cb, scope) {
    library = {
        db: scope.db,
        logger: scope.logger,
        config: scope.config
    }
    self = this;
    setImmediate(cb, null, self);
}

Payments.prototype.shared = {
    sendPayment: (req, cb) => {
        library.logger.debug("sendPayment API initialized");
        if (!req.body) {
            library.logger.error("Invalid Body parameters");
            return setImmediate(cb, "Invalid Body parameters");
        }
        if (process.env.ENV === "dev") {
            StellarSdk.Network.useTestNetwork();
        } else {
            StellarSdk.Network.usePublicNetwork();
        }
        const bridgeServerUrl = library.config.bridgeServer.url;
        
        request.post({
            url: bridgeServerUrl + '/payment',
            form: {
                id: req.body.id,
                amount: req.body.amount,
                asset_code: req.body.asset_code,
                asset_issuer: req.body.asset_issuer,
                destination: req.body.destination,
                source: req.body.source
            }
        })
        .then(response => {
            return setImmediate(cb, null, response);
        })
        .catch(error => {
            return setImmediate(cb, JSON.parse(JSON.parse(error.message.split("-")[1])));
        })
    }
};
Payments.prototype.internal = {};

module.exports = Payments;
