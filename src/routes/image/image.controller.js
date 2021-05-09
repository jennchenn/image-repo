const fs = require('fs');
const path = require('path');
const Repository = require('../../services/repository');

const repositoryService = new Repository();

class ImageController {
    constructor() {
        this.repositoryService = new Repository();
    }

    async uploadImages(user, isPublic, files) {
        try {
            const results = files.map(async (file) => {
                try {
                    const existingImages = await this.repositoryService.searchImageByUser(user.email, this._extractImageName(file.originalname));
                    if (existingImages.length > 0) {
                        throw new Error('Image already exists');
                    }
                    const result = await this._saveImage(user, isPublic, file);
                    const parsedResult = this._parseImageObject(result);
                    return {
                        ...parsedResult,
                        isUploaded: true
                    };
                } catch (err) {
                    console.log(err);
                    return {
                        owner: user.email,
                        name: file.originalname,
                        isUploaded: false,
                        error: err.toString()
                    };
                }
            });

            const res = await Promise.all(results);
            return res;
        } catch (err) {
            return err;
        }
    }

    _saveImage(user, isPublic, file) {
        try {
            const image = fs.readFileSync(file.path);
            const encoded_image = image.toString('base64');
            const upload_image = {
                owner: user.email,
                name: this._extractImageName(file.originalname),
                isPublic: (isPublic !== undefined) ? isPublic.toLowerCase() : false,
                image: {
                    data: Buffer.from(encoded_image, 'base64'),
                    contentType: file.mimetype
                }
            };
            return repositoryService.createImage(upload_image);
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }

    _extractImageName(filename) {
        const name = path.parse(filename).name;
        return name.replace(/\s/g, "");
    }

    async searchByName(email, name) {
        const results = await this.repositoryService.searchImageByName(email, name);
        return results.map(this._parseImageObject);
    }

    _parseImageObject(result) {
        return {
            id: result._id,
            owner: result.owner,
            name: result.name,
            isPublic: result.isPublic,
        };
    }

    async retrieveAllByUser(email) {
        const res = await this.repositoryService.retrieveAllByUser(email);
        return res.map(this._parseImageObject);
    }
}

module.exports = ImageController;