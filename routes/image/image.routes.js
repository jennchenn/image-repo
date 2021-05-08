const jwt = require('jsonwebtoken');
const ImageController = require('./image.controller');

const imageController = new ImageController();

exports.upload = async (req, res) => {
    const user = req.user;
    const result = await imageController.uploadImages(user, req.files);
    res.send(result);
};