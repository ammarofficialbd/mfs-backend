exports.requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'Forbidden. Admin access required.' });
    }
    next();
};

exports.requireAgent = (req, res, next) => {
    if (req.user.role !== 'agent') {
        return res.status(403).send({ error: 'Forbidden. Agent access required.' });
    }
    next();
};