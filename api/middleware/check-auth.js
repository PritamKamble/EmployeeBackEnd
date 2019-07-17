const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log(req.headers.authorization);
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, "secret");
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token Missing',
            error: error
        });
    }
};