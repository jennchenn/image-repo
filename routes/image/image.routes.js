const jwt = require('jsonwebtoken');
const Image = require('../../services/image');

const imageService = new Image();

exports.upload = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET); console.log(user);
    const result = await imageService.uploadImages(user, req.files);
    res.send(result);
};