const express = require("express");
let Router = require('../helpers/router');
let httpApi = require("../helpers/httpApi");

const Payments = (paymentsModule, config, logger, network, constants) => {
    const router = Router();
    router.map(paymentsModule.shared, {
        "post /send": "sendPayment"
    });
    router.map(paymentsModule.internal, {
	});
    httpApi.registerApiEndpoint('/api/payments', network.app, router, true);
}

module.exports = Payments;
