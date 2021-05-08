const jwt = require('jsonwebtoken');
const ImageController = require('./image.controller');

const imageController = new ImageController();

exports.upload = async (req, res) => {
    const user = req.user;
    const result = await imageController.uploadImages(user, req.body.isPublic, req.files);
    res.send(result);
};

exports.searchByName = async (req, res) => {
    try {
        const result = await imageController.searchByName(req.user.email, req.query.name);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: `Error occurred: ${err}` });
    }
};

exports.retrieveAllByUser = async (req, res) => {
    try {
        const result = await imageController.retrieveAllByUser(req.user.email);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: `Error occurred: ${err}` });
    }
};
