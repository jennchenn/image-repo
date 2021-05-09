const Image = require('../models/Image');
const User = require('../models/User');

// Make all queries to database using Repository class
class Repository {
    createUser(email, passwordHash) {
        const user = {
            email: email,
            password: passwordHash
        };
        return User.create(user);
    }

    findUser(email) {
        return User.findOne({
            email
        });
    }

    createImage(upload_image) {
        return Image.create(upload_image);
    }

    // Retrieve all public images as well as images owned by the user
    async searchImageByName(email, name) {
        const allImages = await Image.find({ name: name, isPublic: true });
        const userImages = await this.searchImageByUser(email, name, false);
        return userImages.concat(allImages);
    }

    // Retrieve all images from the user
    async searchImageByUser(email, name, isPublic) {
        if (!isPublic) {
            return Image.find({ owner: email, name });
        } else {
            return Image.find({ owner: email, name, isPublic });
        }
    }

    retrieveAllByUser(email) {
        return Image.find({
            owner: email
        });
    }
};

module.exports = Repository;