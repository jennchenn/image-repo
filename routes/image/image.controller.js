const fs = require('fs');
const Repository = require('../../services/repository');

const repositoryService = new Repository();

class ImageController {
    constructor() {
        this.repositoryService = new Repository();
    }

    async uploadImages(user, files) {
        const results = files.map(async (file) => {
            try {
                const result = await this._saveImage(user, file);
                console.log(result);
                return {
                    id: result._id,
                    owner: result.owner,
                    name: result.name,
                    isUploaded: true
                };
            } catch (err) {
                return {
                    owner: user.email,
                    name: file.originalname,
                    isUploaded: false
                };
            }
        });

        const res = await Promise.all(results);
        return res;
    }

    _saveImage(user, file) {
        const image = fs.readFileSync(file.path);
        const encoded_image = image.toString('base64');
        const upload_image = {
            owner: user.email,
            name: file.originalname,
            image: {
                data: Buffer.from(encoded_image, 'base64'),
                contentType: file.mimetype
            }
        };

        try {
            return repositoryService.createImage(upload_image);
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
}

module.exports = ImageController;