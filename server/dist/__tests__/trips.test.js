"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const User_1 = __importDefault(require("../models/User"));
const mockingoose = require('mockingoose');
const mocks_1 = require("../__mocks__/mocks");
jest.mock('../utils/userUtils');
// const validateUserMock = validateUser as jest.Mock;
// const postRegisterMock = postRegister as jest.Mock;
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'),
    verify: jest.fn().mockReturnValue({ foo: 'bar' }),
    sign: jest.fn().mockReturnValue("token")
}));
// jest.mock('jsonwebtoken')
// jest.mock('dotenv');
describe('User routes', () => {
    afterAll(() => {
        index_1.server.close();
        mockingoose.disconnect();
    });
    beforeEach(() => {
        mockingoose.resetAll(); // Reset the mocked state before each test
        // process.env.SECRET_KEY = 'your-mocked-secret-key'; // Set your mocked SECRET_KEY here
    });
    describe('/user/account/register', () => {
        it('should register a new user', async () => {
            // mockingoose(User).toReturn({}, 'save');
            mockingoose(User_1.default).toReturn(null, 'findOne');
            // mockingoose(User).toReturn(null, 'insertMany');
            // validateUserMock.mockResolvedValue({ userId: '123', user: mockUser });
            // Mock the bcrypt hash function
            const bcryptHash = jest.spyOn(bcrypt_1.default, 'hash');
            bcryptHash.mockResolvedValue('hashedPassword');
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/user/account/register')
                .send(mocks_1.mockRegistrationData);
            expect(User_1.default.insertMany).toHaveBeenCalledWith(expect.any(Object));
            expect(response.status).toBe(201);
            expect(response.body.token).toBeDefined();
        });
        it('should return an error if a user with the same email exists', async () => {
            mockingoose(User_1.default).toReturn(mocks_1.mockUser, 'findOne');
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/user/account/register')
                .send(mocks_1.mockRegistrationData);
            expect(User_1.default.insertMany).toHaveBeenCalledWith(expect.any(Object));
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
        });
    });
    describe('/user/account/login', () => {
        afterAll(() => {
            index_1.server.close();
        });
        beforeEach(() => {
            mockingoose.resetAll();
        });
        it('should log in a user with valid credentials', async () => {
            mockingoose(User_1.default).toReturn(mocks_1.mockUser, 'findOne'); // Mock a user in the database
            const bcryptCompare = jest.spyOn(bcrypt_1.default, 'compare');
            bcryptCompare.mockResolvedValue('hashedPassword');
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/user/account/login')
                .send(mocks_1.mockLoginData); // Send a login request with valid credentials
            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });
        it('should return an error if the user does not exist', async () => {
            mockingoose(User_1.default).toReturn(null, 'findOne'); // Mock a user not found in the database
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/user/account/login')
                .send(mocks_1.mockLoginData);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('User does not exists');
        });
        it('should return an error if the password is incorrect', async () => {
            mockingoose(User_1.default).toReturn(mocks_1.mockUser, 'findOne'); // Mock a user in the database
            const invalidLoginData = { ...mocks_1.mockLoginData, password: 'wrongPassword' };
            const bcryptCompare = jest.spyOn(bcrypt_1.default, 'compare');
            bcryptCompare.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/user/account/login')
                .send(invalidLoginData);
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Incorrect password');
        });
        it('should return an error if credentials are not provided correctly', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/user/account/login')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Credentials not provided correctly');
        });
    });
});
// it('should handle registration error when user already exists', async () => {
//     mockingoose(User).toReturn({ email: 'john.doe@example.com' }, 'findOne');
//     const response = await request(app)
//         .post('/api/user/account/register')
//         .send({
//             name: 'John Doe',
//             email: 'john.doe@example.com',
//             phoneNumber: '1234567890',
//             password: 'password123',
//             imageUrl: 'https://example.com/image.jpg',
//             expoPushToken: 'expoPushToken123',
//         });
//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe('Account with this E-Mail already exists');
// });
// it('should handle registration error when credentials are not provided correctly', async () => {
//     const response = await request(app)
//         .post('/api/user/account/register')
//         .send({
//             name: 'John Doe',
//             // Missing required fields for testing
//         });
//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe('Credentials not provided correctly');
// });
// Similar tests for login and update account can be added
// ...
// It's also recommended to test the error cases for login and update account
