const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.status(401).json({ message: 'No token provided' });
        }
        const token = req.headers.authorization.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        console.log(error);
        if (error === jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token has expired' });
        } else {
            res.status(401).json({ message: 'Unable to authenticate user.' });
        }
    }
};