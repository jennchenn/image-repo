const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const app = require('../src/server');
const supertest = require('supertest');
const User = require('../src/models/User');
const Image = require('../src/models/Image');

const testEmail = 'testimageupload@gmail.com';
const testPass = 'supersecret';
let token;

beforeAll(async () => {
    await User.deleteMany({});
    await supertest(app)
        .post("/user/register")
        .send({
            email: testEmail,
            password: testPass
        });
    const res = await supertest(app)
        .post('/user/login')
        .send({
            email: testEmail,
            password: testPass
        });
    token = res.body.token;
});

beforeEach(async () => {
    await Image.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Image api', () => {
    it('User is able to upload image', async () => {
        const res = await supertest(app)
            .post('/image')
            .set('Authorization', `Bearer ${token}`)
            .attach('images', path.resolve(__dirname, './fixtures/test.png'));
        expect(res.status).toBe(200);
        expect(res.body[0].owner).toBe(testEmail);
        expect(res.body[0].isUploaded).toBe(true);
    });

    it('User is able to search for image', async () => {
        await supertest(app)
            .post('/image')
            .set('Authorization', `Bearer ${token}`)
            .attach('images', path.resolve(__dirname, './fixtures/test.png'));
        const res = await supertest(app)
            .get('/image?name=test')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body[0].owner).toBe(testEmail);
    });

    it('User can retrieve all their images', async () => {
        await supertest(app)
            .post('/image')
            .set('Authorization', `Bearer ${token}`)
            .attach('images', path.resolve(__dirname, './fixtures/test.png'));
        const res = await supertest(app)
            .get('/image/user')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body[0].owner).toBe(testEmail);
    });

    it('Request fails when token invalid', async () => {
        const res = await supertest(app)
            .post('/image')
            .set('Authorization', 'Bearer token')
            .attach('images', path.resolve(__dirname, './fixtures/test.png'));
        expect(res.status).toBe(401);
    });
});