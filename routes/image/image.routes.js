const fs = require('fs');
const jwt = require('jsonwebtoken');
const Image = require('../../models/Image');

exports.upload = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET); console.log(user);
    const image = fs.readFileSync(req.file.path);
    const encoded_image = image.toString('base64');
    const upload_image = {
        owner: user.email,
        name: req.body.name,
        description: req.body.description,
        image: {
            data: Buffer.from(encoded_image, 'base64'),
            contentType: req.file.mimetype
        }
    };

    Image.create(upload_image, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            console.log('Saved to database');
            res.send({ status: 'Success!', result });
        }
    });
};