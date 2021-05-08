const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Email already in use, please sign in." });
            return;
        }
    });

    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = {
        email: req.body.email,
        password: passwordHash
    };

    User.create(user, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            console.log(result);
            console.log('User sucessfully created');
            res.send({
                message: 'User registered!',
                result
            });
        }
    });
};

exports.login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        console.log(`No user found with email ${req.body.email}`);
        res.status(400).json({
            error: 'User does not exist'
        });
    }

    const passwordHash = user.password;
    const match = bcrypt.compareSync(req.body.password, passwordHash);
    if (match) {
        const token = jwt.sign({
            email: user.email,
            userId: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });
        res.status(200).json({
            token,
            email: user.email
        });
    } else {
        res.status(401).json({
            error: 'Invalid password supplied.'
        });
    }
    res.send({ auth: match });
};