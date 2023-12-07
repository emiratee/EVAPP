"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const Trip_1 = __importDefault(require("../models/Trip"));
const User_1 = __importDefault(require("../models/User"));
const mockingoose = require('mockingoose');
const mocks_1 = require("../__mocks__/mocks");
const userUtils_1 = require("../utils/userUtils");
jest.mock('../utils/userUtils');
const validateUserMock = userUtils_1.validateUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose = require('mongoose');
jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'),
    verify: jest.fn().mockReturnValue({ foo: 'bar' }),
    sign: jest.fn().mockReturnValue("token")
}));
describe('User routes', () => {
    afterAll(async () => {
        jest.clearAllMocks();
        await mongoose.connection.close();
    });
    beforeEach(() => {
        mockingoose.resetAll();
    });
    describe('Register user route', () => {
        it('should register a new user', async () => {
            mockingoose(User_1.default).toReturn(null, 'findOne');
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
    describe('Login User route', () => {
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
    describe('Update User route', () => {
        it('should update user image successfully', async () => {
            // mockingoose(User).toReturn(null, 'updateOne');
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/account/update')
                .send(mocks_1.mockImageData);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Image changed successfully');
        });
        it('should update the user password successfully', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            const bcryptCompare = jest.spyOn(bcrypt_1.default, 'compare');
            bcryptCompare.mockResolvedValue('hashedPassword');
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/account/update')
                .send(mocks_1.mockNewPasswordData);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password changed successfully');
        });
        it('should return an error for missing parameters', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/account/update')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Required parameters not provided correctly');
        });
        it('should return an error for incorrect current password', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            const bcryptCompare = jest.spyOn(bcrypt_1.default, 'compare');
            bcryptCompare.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/account/update')
                .send({ currentPassword: 'wrong-password', newPassword: 'new-password' });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Current password is incorrect');
        });
    });
    describe('Create Trip route', () => {
        it('should create a new trip with valid data', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            mockingoose(Trip_1.default).toReturn([mocks_1.mockTrip], 'insertMany');
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/trip/create')
                .send(mocks_1.mockTrip);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Successfully created trip');
            expect(response.body.trip).toBeDefined();
        });
        it('should return an error if user authentication fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/trip/create')
                .send(mocks_1.mockTrip);
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Authentication failed');
        });
        it('should return an error if trip data is invalid', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            mockingoose(Trip_1.default).toReturn(null, 'insertMany'); // Mock failed trip insertion
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/trip/create')
                .send(mocks_1.mockTrip);
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error');
        });
    });
    describe('Get Trips route', () => {
        it('should return filtered trips when valid query parameters are provided', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            jest.mock('../controllers/userController', () => ({
                getDriver: jest.fn().mockResolvedValue(mocks_1.mockUser), // Mock the getDriver function
            }));
            mockingoose(Trip_1.default).toReturn([mocks_1.mockTrip], 'find'); // Mock failed trip insertion
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/trips')
                .query({
                departureCountry: 'USA',
                departureCity: 'New York',
                date: '2023-01-01',
                seats: 2,
            });
            expect(response.status).toBe(200);
            expect(response.body.trips).toEqual(expect.any(Array));
            expect(response.body.trips.length).toBe(1);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            mockingoose(Trip_1.default).toReturn(null, 'find'); // Mock failed trip insertion
            // Mock the validateUser function to throw an error
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/trips')
                .query({
                departureCountry: 'USA',
                departureCity: 'New York',
                date: '2023-01-01',
                seats: 2,
            });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error');
        });
    });
    describe('Mark as Success Trip route', () => {
        it('should update a trip successfully when valid data is provided', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            const mockUpdatedTrip = { ...mocks_1.mockTrip, successful: true }; // Mock an updated trip
            // Mock the Trip.updateOne function to update the trip
            //   jest.spyOn(Trip, 'updateOne').mockResolvedValue({ nModified: 1 });
            mockingoose(Trip_1.default).toReturn({ nModified: 1 }, 'updateOne'); // Mock failed trip insertion
            // Mock the Trip.findOne function to return the updated trip
            //   jest.spyOn(Trip, 'findOne').mockResolvedValue(mockUpdatedTrip);
            mockingoose(Trip_1.default).toReturn(mockUpdatedTrip, 'findOne'); // Mock failed trip insertion
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/trips/success')
                .send({ data: { tripId: '12345', successful: true } });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip edited successfully');
            expect(response.body.trip.successful).toEqual(true);
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/trips/success')
                .send({ data: { tripId: '12345', successful: true } });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            jest.spyOn(Trip_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/trips/success')
                .send({ data: { tripId: '12345', successful: true } });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putTripSuccessful');
        });
    });
    describe('Request a Trip route', () => {
        it('should make a booking request successfully when valid data is provided', async () => {
            const mockTripUpdated = { ...mocks_1.mockTrip, seats: { available: 5 } }; // Mock a trip
            const mockUpdatedTrip = { ...mocks_1.mockTrip, passengerIDs: [{ bookingId: 'unique_booking_id' }] }; // Mock an updated trip
            const totalSum = 2 * Number(mocks_1.mockTrip.price); // Calculate the total sum
            jest.mock('../utils/userUtils', () => ({
                sendPushNotification: jest.fn(),
            }));
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the Trip.updateOne function to update the trip
            jest.spyOn(Trip_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            // Mock the Trip.findOne function to return the updated trip
            jest.spyOn(Trip_1.default, 'findOne').mockResolvedValue(mockUpdatedTrip);
            // Mock the User.updateOne function to update the user
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            // Mock the User.findOne function to return the trip driver
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue(mocks_1.mockUser);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/trips/request')
                .send({ data: { tripId: '12345', seats: 2 } });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip edited successfully');
            expect(response.body.trip).toEqual(mockUpdatedTrip);
            //   expect(uuidv4).toHaveBeenCalledTimes(1); // Ensure uuidv4 was called once
            expect(User_1.default.updateOne).toHaveBeenCalledWith({ userId: mocks_1.mockUser.userId }, {
                $push: { tripsAsPassengerIDs: '12345' },
                $set: {
                    'credits.onHold': Number(mocks_1.mockUser.credits.onHold) + totalSum,
                    'credits.available': Number(mocks_1.mockUser.credits.available) - totalSum,
                },
            });
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/trips/request')
                .send({ data: { tripId: '12345', seats: 2 } });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            jest.spyOn(Trip_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/trips/request')
                .send({ data: { tripId: '12345', seats: 2 } });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putMakeRequest');
        });
    });
    describe('Add Review route', () => {
        it('should add a review successfully when valid data is provided', async () => {
            const mockDriver = { userId: 'driver123', driverRating: { totalReviews: 10, totalRating: 40 } }; // Mock a driver
            const mockTrip = { _id: 'trip123', passengerIDs: [{ userId: mocks_1.mockUser.userId, reviewed: false }] }; // Mock a trip
            const rating = 5; // Mock a rating
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.findOne function to return the driver
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue(mockDriver);
            // Mock the User.updateOne function to update the driver's rating
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            // Mock the Trip.updateOne function to update the trip as reviewed
            jest.spyOn(Trip_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/review/driverRating')
                .send({ data: { tripId: 'trip123', driverId: 'driver123', rating } });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('putAddReview Changed ');
            expect(User_1.default.updateOne).toHaveBeenCalledWith({ userId: 'driver123' }, {
                $set: {
                    'driverRating.totalReviews': 11,
                    'driverRating.totalRating': 45,
                },
            });
            expect(Trip_1.default.updateOne).toHaveBeenCalledWith({ _id: 'trip123', "passengerIDs.userId": mocks_1.mockUser.userId }, {
                $set: { "passengerIDs.$.reviewed": true },
            });
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/review/driverRating')
                .send({ data: { tripId: 'trip123', driverId: 'driver123', rating: 5 } });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.findOne function to throw an error
            jest.spyOn(User_1.default, 'findOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/review/driverRating')
                .send({ data: { tripId: 'trip123', driverId: 'driver123', rating: 5 } });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putAddReview');
        });
    });
    describe('Get User route', () => {
        // it('should get the user successfully when valid user is provided', async () => {
        //     validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });
        //     // mocking the .toObject method to return desired response
        //     User.toObject = jest
        //         .fn()
        //         .mockReturnValue({ ...mockUser})
        //     const response = await request(app)
        //         .get('/user')
        //         .send();
        //     expect(response.status).toBe(200);
        //     expect(response.body).toEqual(
        //         expect.objectContaining({
        //             userId: mockUser.userId,
        //             name: mockUser.name,
        //             email: mockUser.email,
        //         })
        //     );
        // });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/user')
                .send();
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
    });
    describe('Add Car route', () => {
        it('should add a car successfully when valid data is provided', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            const mockUpdatedUser = { ...mocks_1.mockUser, cars: [mocks_1.mockCar1] }; // Mock an updated user with the added car
            // Mock the User.updateOne function to update the user's cars
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            // Mock the User.findOne function to return the updated user
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue(mockUpdatedUser);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/cars')
                .send(mocks_1.mockCar1);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Car added successfully');
            expect(response.body.car).toEqual(mocks_1.mockCar1);
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/cars')
                .send(mocks_1.mockCar1);
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to throw an error
            jest.spyOn(User_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/cars')
                .send(mocks_1.mockCar1);
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putCar');
        });
    });
    describe('Get User History route', () => {
        it('should get user history successfully when valid user is provided', async () => {
            jest.mock('../controllers/userController', () => ({
                getDriver: jest.fn(),
            }));
            const mockTrips = [mocks_1.mockTrip, mocks_1.mockTrip]; // Mock user trips
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the find functions to return user trips
            jest.spyOn(Trip_1.default, 'find').mockResolvedValue(mockTrips);
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/user/history')
                .send();
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(mockTrips.length + mocks_1.mockUser.tripsAsDriverIDs.length);
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/user/history')
                .send();
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the find functions to throw an error
            jest.spyOn(Trip_1.default, 'find').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/user/history')
                .send();
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in getHistory');
        });
    });
    describe('Add Trip as Driver route', () => {
        it('should add a trip as a driver successfully when valid data is provided', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to update the user's tripsAsDriverIDs
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/trips/driver')
                .send({ _id: 'trip123' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip as Driver added successfully');
            expect(User_1.default.updateOne).toHaveBeenCalledWith({ userId: mocks_1.mockUser.userId }, {
                $push: { tripsAsDriverIDs: 'trip123' },
            });
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/trips/driver')
                .send({ _id: 'trip123' });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to throw an error
            jest.spyOn(User_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/trips/driver')
                .send({ _id: 'trip123' });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putCar');
        });
    });
    describe('Update Available Credits route', () => {
        it('should update available credits successfully when valid data is provided', async () => {
            const currentCredits = 100; // Mock current available credits
            const newCredits = 50; // Mock new credits to add
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to update the user's available credits
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            // Mock the User.findOne function to return the updated user
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue({ ...mocks_1.mockUser, credits: { available: currentCredits + newCredits } });
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/available')
                .send({ amount: newCredits });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Available Credits Changed');
            expect(response.body.credits.available).toBe(currentCredits + newCredits);
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/available')
                .send({ amount: 50 });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            const newCredits = 50; // Mock new credits to add
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to throw an error
            jest.spyOn(User_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/available')
                .send({ amount: newCredits });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putAvailableCredits');
        });
    });
    describe('Update On-Hold Credits route', () => {
        it('should update on-hold credits successfully when valid data is provided', async () => {
            const currentCredits = 100; // Mock current on-hold credits
            const newCredits = 50; // Mock new credits to add
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to update the user's on-hold credits
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            // Mock the User.findOne function to return the updated user
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue({ ...mocks_1.mockUser, credits: { onHold: currentCredits + newCredits } });
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/hold')
                .send({ amount: newCredits });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('OnHold Credits Changed ');
            expect(response.body.credits.onHold).toBe(currentCredits + newCredits);
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/hold')
                .send({ amount: 50 });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            const newCredits = 50; // Mock new credits to add
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to throw an error
            jest.spyOn(User_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/hold')
                .send({ amount: newCredits });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putOnHoldCredits');
        });
    });
    describe('Update Earnings On-Hold Credits route', () => {
        it('should update earnings on-hold credits successfully when valid data is provided', async () => {
            const currentCredits = 100; // Mock current earnings on-hold credits
            const newCredits = 50; // Mock new credits to add
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to update the user's earnings on-hold credits
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            // Mock the User.findOne function to return the updated user
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue({ ...mocks_1.mockUser, credits: { earningsOnHold: currentCredits + newCredits } });
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/earnings')
                .send({ amount: newCredits });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('earningsOnHold Credits Changed ');
            expect(response.body.credits.earningsOnHold).toBe(currentCredits + newCredits);
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/earnings')
                .send({ amount: 50 });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            const newCredits = 50; // Mock new credits to add
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to throw an error
            jest.spyOn(User_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/earnings')
                .send({ amount: newCredits });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putearningsOnHoldCredits');
        });
    });
    describe('Update Earnings to Available Credits route', () => {
        it('should update earnings to available credits successfully when valid data is provided', async () => {
            const currentOnHoldEarnings = 100; // Mock current earnings on-hold credits
            const currentAvailable = 50; // Mock current available credits
            const totalCredits = 30; // Mock total credits to transfer
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to update the user's earnings to available credits
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            // Mock the User.findOne function to return the updated user
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue({ ...mocks_1.mockUser, credits: { earningsOnHold: currentOnHoldEarnings - totalCredits, available: currentAvailable + totalCredits } });
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/earningsToAvailable')
                .send({ data: { totalCredits } });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('putEarningsToAvailable Credits Changed ');
            expect(response.body.credits.earningsOnHold).toBe(currentOnHoldEarnings - totalCredits);
            expect(response.body.credits.available).toBe(currentAvailable + totalCredits);
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/earningsToAvailable')
                .send({ data: { totalCredits: 30 } });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            const totalCredits = 30; // Mock total credits to transfer
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            // Mock the User.updateOne function to throw an error
            jest.spyOn(User_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/credits/earningsToAvailable')
                .send({ data: { totalCredits } });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putEarningsToAvailable');
        });
    });
    describe('Approve Passenger route', () => {
        it('should approve a passenger and update user credits successfully when valid data is provided', async () => {
            const totalCredits = 30; // Mock total credits
            const trip = mocks_1.mockTripWithId; // Assume the trip is valid
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            jest.spyOn(Trip_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue({ ...mocks_1.passenger });
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue({ ...mocks_1.mockUser, credits: { earningsOnHold: 100 } });
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/trips/approve')
                .send({
                data: {
                    tripId: trip._id,
                    passengerId: mocks_1.passenger.userId,
                    bookingId: mocks_1.passenger.bookingId,
                    totalCredits,
                },
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip edited successfully');
            expect(Trip_1.default.updateOne).toHaveBeenCalledWith({ _id: trip._id, 'passengerIDs.bookingId': mocks_1.passenger.bookingId }, { $set: { 'passengerIDs.$.status': 'Approved' } }, { new: true });
            expect(User_1.default.findOne).toHaveBeenCalledWith({ userId: mocks_1.passenger.userId });
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/trips/approve')
                .send({
                data: {
                    tripId: '12345',
                    passengerId: '67890',
                    bookingId: 'ABCDE',
                    totalCredits: 30,
                },
            });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            const totalCredits = 30; // Mock total credits
            const trip = mocks_1.mockTripWithId; // Assume the trip is valid
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            jest.spyOn(Trip_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/trips/approve')
                .send({
                data: {
                    tripId: trip._id,
                    passengerId: mocks_1.passenger.userId,
                    bookingId: mocks_1.passenger.bookingId,
                    totalCredits,
                },
            });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putCar');
        });
    });
    describe('Reject Passenger route', () => {
        it('should reject a passenger and update user credits successfully when valid data is provided', async () => {
            const totalCredits = 30; // Mock total credits
            const trip = mocks_1.mockTripWithId; // Assume the trip is valid
            const seats = 2; // Mock the number of seats previously booked by the passenger
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            jest.spyOn(Trip_1.default, 'findOne').mockResolvedValue({ ...trip, passengerIDs: [{ bookingId: mocks_1.passenger.bookingId, seats }] });
            jest.spyOn(Trip_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            jest.spyOn(User_1.default, 'findOne').mockResolvedValue({ ...mocks_1.passenger });
            jest.spyOn(User_1.default, 'updateOne').mockResolvedValue({ nModified: 1 });
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/trips/reject')
                .send({
                data: {
                    tripId: trip._id,
                    passengerId: mocks_1.passenger.userId,
                    bookingId: mocks_1.passenger.bookingId,
                    totalCredits,
                },
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip edited successfully');
            expect(Trip_1.default.updateOne).toHaveBeenCalledWith({ _id: trip._id, 'passengerIDs.bookingId': mocks_1.passenger.bookingId }, {
                $set: { 'passengerIDs.$.status': 'Rejected' },
                $inc: { 'seats.available': seats },
            });
            expect(User_1.default.findOne).toHaveBeenCalledWith({ userId: mocks_1.passenger.userId });
        });
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/trips/reject')
                .send({
                data: {
                    tripId: '12345',
                    passengerId: '67890',
                    bookingId: 'ABCDE',
                    totalCredits: 30,
                },
            });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            const totalCredits = 30; // Mock total credits
            const trip = mocks_1.mockTripWithId; // Assume the trip is valid
            const seats = 2; // Mock the number of seats previously booked by the passenger
            validateUserMock.mockResolvedValue({ userId: '123456', user: mocks_1.mockUser });
            jest.spyOn(Trip_1.default, 'findOne').mockResolvedValue({ ...trip, passengerIDs: [{ bookingId: mocks_1.passenger.bookingId, seats }] });
            jest.spyOn(Trip_1.default, 'updateOne').mockRejectedValue(new Error('Internal error'));
            const response = await (0, supertest_1.default)(index_1.app)
                .put('/user/trips/reject')
                .send({
                data: {
                    tripId: trip._id,
                    passengerId: mocks_1.passenger.userId,
                    bookingId: mocks_1.passenger.bookingId,
                    totalCredits,
                },
            });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putRejectPassenger');
        });
    });
});
