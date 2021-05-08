const fs = require('fs');
const Image = require('../../models/Image');

exports.upload = (req, res) => {
    const image = fs.readFileSync(req.file.path);
    const encoded_image = image.toString('base64');
    const upload_image = {
        owner: req.body.owner,
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
            console.log('Saved To database');
            res.send({ status: 'Success!' });
        }
    });
};