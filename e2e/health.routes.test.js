const mongoose = require('mongoose');
const app = require('../server');
const supertest = require('supertest');

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Test health api', () => {
    it('Test health', async () => {
        await supertest(app)
            .get("/health")
            .expect(200);
    });
});
