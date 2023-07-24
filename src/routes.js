function routes(app) {
    app.use('/users', require('./routes/users'));
    return
}

module.exports = routes;