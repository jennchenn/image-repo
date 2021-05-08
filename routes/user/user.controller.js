const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Repository = require('../../services/repository');

class UserController {
    constructor() {
        this.repositoryService = new Repository();
    }

    async findUser(email) {
        return this.repositoryService.findUser(email);
    }

    async register(email, password) {
        const saltRounds = 10;
        const passwordHash = bcrypt.hashSync(password, saltRounds);

        return this.repositoryService.createUser(email, passwordHash);
    }

    async matchPassword(user, password) {
        const passwordHash = user.password;
        return bcrypt.compareSync(password, passwordHash);
    }

    async generateToken(user) {
        const token = jwt.sign({
            email: user.email,
            userId: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });

        return {
            token,
            email: user.email
        };
    }
}

module.exports = UserController;