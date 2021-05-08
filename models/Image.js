const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    owner: String,
    name: String,
    image: {
        data: Buffer,
        contentType: String
    },
    description: String
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;