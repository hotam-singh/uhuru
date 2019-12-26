let middlewares = {
    /**
	 * Adds CORS header to all requests.
	 * @param {Object} req
	 * @param {Object} res
	 * @param {Function} next
	 */
	cors: function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Objected-With, Content-Type, Accept');
		return next();
    },

    /**
	 * Resends error if API endpoint doesn't exists.
	 * @param {Object} req
	 * @param {Object} res
	 * @param {Function} next
	 */
    notFound: (req, res, next) => {
		return res.status(500).send({success: false, error: 'API endpoint not found'});
	}
};

let registerApiEndpoint = (route, app, router) => {
    router.use(middlewares.notFound);
	app.use(route, router);
}

let respond = (res, err, response) => {
	if (err) {
		res.json({'success': false, 'error': err});
	} else {
		return res.json(extend({}, {'success': true}, response));
	}
}

module.exports = {
    middlewares: middlewares,
    registerApiEndpoint: registerApiEndpoint,
    respond: respond
}
