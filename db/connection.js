const mongoose = require("mongoose");
const __private = {};

const connect = (appConfig, logger, constants, cb) => {
    //const uri = `mongodb://${appConfig.db.user}:${appConfig.db.password}@${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.database}`;
    const promise = require('bluebird');
	let pgOptions = {
		promiseLib: promise
	};

	let pgp = require('pg-promise')(pgOptions);
	let monitor = require('pg-monitor');

	monitor.attach(pgOptions);
	monitor.setTheme('matrix');

	monitor.log = function (msg, info){
		info.display = false;
	};

    let db = pgp(appConfig.db);
    cb(null, db);
}

const disconnect = (cb) => {
    mongoose.connection.close();
    cb(null);
}

module.exports = {
    connect: connect,
    disconnect: disconnect
}
