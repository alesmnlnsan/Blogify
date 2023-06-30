function requestToDeleteMethod(req, res, next) {
    if (req.query._method == 'DELETE') {
        req.method = 'DELETE';

        req.url = req.path;
    }
    next();
}

module.exports = requestToDeleteMethod