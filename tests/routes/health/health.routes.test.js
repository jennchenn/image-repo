const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../../server');
const supertest = require('supertest');

// Allow extra time to download MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;

beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Test health api', () => {
    it('Test health', async () => {
        await supertest(app)
            .get("/health")
            .expect(200);
    });
});
