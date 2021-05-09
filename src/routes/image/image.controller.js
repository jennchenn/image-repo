const fs = require('fs');
const path = require('path');
const Repository = require('../../services/repository');

const repositoryService = new Repository();

class ImageController {
    constructor() {
        this.repositoryService = new Repository();
    }

    // Only allow user to upload images if it doesn't exist already under that user
    async uploadImages(user, isPublic, files) {
        try {
            const results = files.map(async (file) => {
                try {
                    const existingImages = await this.repositoryService.searchImageByUser(user.email, this._extractImageName(file.originalname));
                    if (existingImages.length > 0) {
                        console.log(`Image already exists with name: ${file.originalname}`);
                        throw new Error('Image already exists');
                    }
                    const result = await this._saveImage(user, isPublic, file);
                    console.log(`Image saved with name ${result.name}`);
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

    // Images are saved with the original file name
    _extractImageName(filename) {
        const name = path.parse(filename).name;
        return name.replace(/\s/g, "");
    }

    async searchByName(email, name) {
        console.log(`Searching for image with name: ${name}`);
        const results = await this.repositoryService.searchImageByName(email, name);
        return results.map(this._parseImageObject);
    }

    // Modify return object to not return image binary with the result
    _parseImageObject(result) {
        return {
            id: result._id,
            owner: result.owner,
            name: result.name,
            isPublic: result.isPublic,
        };
    }

    async retrieveAllByUser(email) {
        console.log(`Retrieving all images for user with email: ${email}`);
        const res = await this.repositoryService.retrieveAllByUser(email);
        return res.map(this._parseImageObject);
    }
}

module.exports = ImageController;