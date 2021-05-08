const Image = require('../models/Image');

class Repository {
    createImage(upload_image) {
        return Image.create(upload_image);
    }
};

module.exports = Repository;