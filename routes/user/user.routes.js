const UserController = require('./user.controller');

const userController = new UserController();

exports.register = async (req, res) => {
    try {
        const existingUser = await userController.findUser(req.body.email);
        if (existingUser) {
            res.status(400).send({ message: 'Email already in use please sign in' });
            return;
        }
        const result = await userController.register(req.body.email, req.body.password);
        res.status(200)
            .send({
                message: 'User registered!',
                email: result.email
            });
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

exports.login = async (req, res) => {
    try {
        const existingUser = await userController.findUser(req.body.email);
        if (!existingUser) {
            res.status(400).send({ message: 'User does not exist; please register' });
            return;
        }
        const result = await userController.matchPassword(existingUser, req.body.password);
        if (!result) {
            res.status(401).send({ message: 'Incorrect password supplied' });
            return;
        }
        const token = await userController.generateToken(existingUser);
        res.status(200).send(token);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};