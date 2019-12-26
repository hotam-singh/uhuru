let library;

function Users(cb, scope)  {
    library = {
        db: scope.db,
        logger: scope.logger,
        config: scope.config
    }
    self = this;
    setImmediate(cb, null, self);
}

Users.prototype.shared = {
    sendPayment: (req, cb) => {
        library.logger.debug("sendPayment API initialized");
    }
};
Users.prototype.internal = {};

module.exports = Users;
