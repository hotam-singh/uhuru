/**
 * require application dependencies
 */
let dotenv = require("dotenv");
let domain = require("domain");
let async = require("async");

/**
 * dotenv configuration and error handling
 */
const dotenvResult = dotenv.config();

if (dotenvResult.error) {
    throw dotenvResult.error
}

/**
* require userdefined dependencies
*/
const config = require(`./config/${process.env.ENV}/config`);
const constants = require(`./config/${process.env.ENV}/constants`);
const logger = require("./helpers/logger/winston")(config);
require("./helpers/init").createLogsDir(config);

d = domain.create();
//logger.error("domain master error: ");
d.on("error", (err) => {
    logger.error(eval('`' + constants.errorMessages.DOMAIN_MASTER + '`'));
})

d.run(() => {
    let modules = [];
    async.auto({
        config: (cb) => {
            cb(null, config);
        },
        constants: (cb) => {
            cb(null, constants);
        },
        logger: (cb) => {
            cb(null, logger);
        },
        db: ["config", "logger", "constants", (scope, cb) => {
            const db = require("./db/connection");
            db.connect(scope.config, scope.logger, scope.constants, cb);
        }],
        network: ["config", (scope, cb) => {
            let express = require("express");
            let app = express();
            let server = "";
            let path = require('path');
			let bodyParser = require('body-parser');
			let cookieParser = require('cookie-parser');
			let methodOverride = require('method-override');

			app.engine('html', require('ejs').renderFile);
			app.use(require('express-domain-middleware'));
			app.set('view engine', 'ejs');
			app.set('views', path.join(__dirname, 'public'));
			app.use(express.static(path.join(__dirname, 'public')));
			app.use(bodyParser.raw({ limit: '2mb' }));
			app.use(bodyParser.urlencoded({ extended: true, limit: '2mb', parameterLimit: 5000 }));
			app.use(bodyParser.json({ limit: '2mb' }));
			app.use(methodOverride());
			app.use(cookieParser());
            if(scope.config.ssl.enabled) {
                server = require("https").createServer(app);
            } else {
                server = require("http").createServer(app);
            }
            let io = require("socket.io")(server);
            cb(null, {
                express: express,
                app: app,
                io: io,
                server: server
            })
        }],
        swagger: (cb) => {
            cb(null);
        },
        modules: ["config", "logger", "network", "constants", (scope, cb) => {
            let tasks = {};

			Object.keys(config.modules).forEach(function (name) {
				tasks[name] = function (cb) {
					let d = require('domain').create();

					d.on('error', function (err) {
						console.log('error : ', err.stack);
						scope.logger.error('Domain ' + name, { message: err.message, stack: err.stack });
					});

					d.run(function () {
						logger.debug('Loading module', name);
						let Klass = require(config.modules[name].http);
						let obj = new Klass(cb, scope);
						modules.push(obj);
					});
				};
			});

			async.parallel(tasks, function (err, results) {
				cb(err, results);
			});
        }],
        api: ["config", "logger", "network", "constants", "modules", (scope, cb) => {
            Object.keys(scope.config.api).forEach(moduleName => {
                Object.keys(scope.config.api[moduleName]).forEach(protocol => {
                    try {
                        scope.logger.debug(eval('`' + scope.constants.successMessages.APP.LOEADING_API_ENDPOINT + '`'));
                        let apiEndPoint = require(scope.config.api[moduleName][protocol])(scope.modules[moduleName], scope.config, scope.logger, scope.network, scope.constants);
                    } catch (error) {
                        scope.logger.error(eval('`' + scope.constants.errorMessages.API_ERROR.LOAD_API_ENDPOINT + '`'));
                    }
                })
                
            })
        }],
        listen: ["config", "network", "logger", (scope, cb) => {
            scope.network.server.listen(scope.config.app.port, () => {
                scope.logger.info(eval('`' + constants.successMessages.APP_CONNECTED + '`'));
            });
        }] 
    })
});
