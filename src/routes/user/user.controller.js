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
        const saltRounds = parseInt(process.env.NUM_SALT_ROUNDS);
        const passwordHash = bcrypt.hashSync(password, saltRounds);
        return this.repositoryService.createUser(email, passwordHash);
    }

    // Compare password with the hash saved to the database
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