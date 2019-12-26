const express = require("express");
let Router = require('../helpers/router');
let httpApi = require("../helpers/httpApi");

const Users = (accountsModule, config, logger, network, constants) => {
    const router = Router();
    router.map(accountsModule.shared, {
    });
    router.map(accountsModule.internal, {
	});
    httpApi.registerApiEndpoint('/api/users', network.app, router, true);
}

module.exports = Users
