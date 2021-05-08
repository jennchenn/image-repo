const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log(req.headers);
    console.log(req.body);
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'No token provided' });
    }
};