const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/server');
const supertest = require('supertest');
const User = require('../src/models/User');
const Image = require('../src/models/Image');

beforeEach(async () => {
    await User.deleteMany({});
    await Image.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('User api', () => {
    it('Check test database is cleared', async () => {
        const imageCount = await Image.countDocuments();
        expect(imageCount).toEqual(0);
        const userCount = await User.countDocuments();
        expect(userCount).toEqual(0);
    });

    it('User registration successful', async () => {
        const testEmail = 'test123@gmail.com';
        const res = await supertest(app)
            .post("/user/register")
            .send({
                email: testEmail,
                password: 'supersecret'
            });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'User registered!', email: testEmail });
    });

    it('User registration unsuccessful: duplicate email', async () => {
        const testEmail = 'test123@gmail.com';
        const firstRegistration = await supertest(app)
            .post("/user/register")
            .send({
                email: testEmail,
                password: 'supersecret'
            });
        expect(firstRegistration.status).toBe(200);
        expect(firstRegistration.body).toEqual({ message: 'User registered!', email: testEmail });
        const secondRegistration = await supertest(app)
            .post("/user/register")
            .send({
                email: testEmail,
                password: 'supersecret'
            });
        expect(secondRegistration.status).toBe(400);
        expect(secondRegistration.body).toEqual({ message: 'Email already in use please sign in' });
    });

    it('User login successful', async () => {
        const testEmail = 'test123@gmail.com';
        const testPassword = 'supersecret';
        await supertest(app)
            .post('/user/register')
            .send({
                email: testEmail,
                password: testPassword
            });

        const res = await supertest(app)
            .post('/user/login')
            .send({
                email: testEmail,
                password: testPassword
            });
        expect(res.status).toBe(200);
        expect(res.body.email).toBe(testEmail);
    });

    it('User login unsuccessful: no such user', async () => {
        const testEmail = 'test123@gmail.com';
        const testEmailIncorrect = 'test12@gmail.com';
        const testPassword = 'supersecret';
        await supertest(app)
            .post('/user/register')
            .send({
                email: testEmail,
                password: testPassword
            });

        const res = await supertest(app)
            .post('/user/login')
            .send({
                email: testEmailIncorrect,
                password: testPassword
            });
        expect(res.status).toBe(400);
    });

    it('User login unsuccessful: incorrect password', async () => {
        const testEmail = 'test123@gmail.com';
        const testPassword = 'supersecret';
        const testPasswordIncorrect = 'verysecret';
        await supertest(app)
            .post('/user/register')
            .send({
                email: testEmail,
                password: testPassword
            });

        const res = await supertest(app)
            .post('/user/login')
            .send({
                email: testEmail,
                password: testPasswordIncorrect
            });
        expect(res.status).toBe(401);
    });
});