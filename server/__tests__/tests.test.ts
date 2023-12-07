import request from 'supertest';
import { app, server } from '../index';
import Trip from '../models/Trip';
import User from '../models/User';
const mockingoose = require('mockingoose')
import { mockUser, mockRegistrationData, mockLoginData, mockImageData, mockNewPasswordData, mockTrip, mockCar1, mockTripWithId, passenger } from '../__mocks__/mocks';
import { validateUser } from '../utils/userUtils';
jest.mock('../utils/userUtils');
const validateUserMock = validateUser as jest.Mock;
import bcrypt from 'bcrypt';

const mongoose = require('mongoose');


jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'), // import and retain the original functionalities
    verify: jest.fn().mockReturnValue({ foo: 'bar' }), // overwrite verify
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
            mockingoose(User).toReturn(null, 'findOne');

            const bcryptHash = jest.spyOn(bcrypt, 'hash') as jest.Mock;
            bcryptHash.mockResolvedValue('hashedPassword');

            const response = await request(app)
                .post('/user/account/register')
                .send(mockRegistrationData);

            expect(User.insertMany).toHaveBeenCalledWith(expect.any(Object));
            expect(response.status).toBe(201);
            expect(response.body.token).toBeDefined();
        });

        it('should return an error if a user with the same email exists', async () => {
            mockingoose(User).toReturn(mockUser, 'findOne');

            const response = await request(app)
                .post('/user/account/register')
                .send(mockRegistrationData);
            expect(User.insertMany).toHaveBeenCalledWith(expect.any(Object));
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
        });
    });


    describe('Login User route', () => {


        it('should log in a user with valid credentials', async () => {
            mockingoose(User).toReturn(mockUser, 'findOne'); // Mock a user in the database

            const bcryptCompare = jest.spyOn(bcrypt, 'compare') as jest.Mock;
            bcryptCompare.mockResolvedValue('hashedPassword');

            const response = await request(app)
                .post('/user/account/login')
                .send(mockLoginData); // Send a login request with valid credentials

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('should return an error if the user does not exist', async () => {
            mockingoose(User).toReturn(null, 'findOne'); // Mock a user not found in the database

            const response = await request(app)
                .post('/user/account/login')
                .send(mockLoginData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('User does not exists');
        });

        it('should return an error if the password is incorrect', async () => {
            mockingoose(User).toReturn(mockUser, 'findOne'); // Mock a user in the database

            const invalidLoginData = { ...mockLoginData, password: 'wrongPassword' };

            const bcryptCompare = jest.spyOn(bcrypt, 'compare') as jest.Mock;
            bcryptCompare.mockResolvedValue(false);


            const response = await request(app)
                .post('/user/account/login')
                .send(invalidLoginData);

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Incorrect password');
        });

        it('should return an error if credentials are not provided correctly', async () => {
            const response = await request(app)
                .post('/user/account/login')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Credentials not provided correctly');
        });
    });



    describe('Update User route', () => {


        it('should update user image successfully', async () => {

            // mockingoose(User).toReturn(null, 'updateOne');

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });


            const response = await request(app)
                .put('/user/account/update')
                .send(mockImageData);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Image changed successfully');
        });

        it('should update the user password successfully', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            const bcryptCompare = jest.spyOn(bcrypt, 'compare') as jest.Mock;
            bcryptCompare.mockResolvedValue('hashedPassword');

            const response = await request(app)
                .put('/user/account/update')
                .send(mockNewPasswordData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password changed successfully');
        });

        it('should return an error for missing parameters', async () => {
            const response = await request(app)
                .put('/user/account/update')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Required parameters not provided correctly');
        });

        it('should return an error for incorrect current password', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            const bcryptCompare = jest.spyOn(bcrypt, 'compare') as jest.Mock;
            bcryptCompare.mockResolvedValue(false);

            const response = await request(app)
                .put('/user/account/update')
                .send({ currentPassword: 'wrong-password', newPassword: 'new-password' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Current password is incorrect');
        });
    });


    describe('Create Trip route', () => {
        it('should create a new trip with valid data', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });
            mockingoose(Trip).toReturn([mockTrip], 'insertMany');
            const response = await request(app)
                .post('/trip/create')
                .send(mockTrip);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Successfully created trip');
            expect(response.body.trip).toBeDefined();
        });


        it('should return an error if user authentication fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
                .post('/trip/create')
                .send(mockTrip);

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Authentication failed');
        });

        it('should return an error if trip data is invalid', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            mockingoose(Trip).toReturn(null, 'insertMany'); // Mock failed trip insertion

            const response = await request(app)
                .post('/trip/create')
                .send(mockTrip);

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error');
        });
    });

    describe('Get Trips route', () => {

        it('should return filtered trips when valid query parameters are provided', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            jest.mock('../controllers/userController', () => ({
                getDriver: jest.fn().mockResolvedValue(mockUser), // Mock the getDriver function
            }));
            mockingoose(Trip).toReturn([mockTrip], 'find'); // Mock failed trip insertion


            const response = await request(app)
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
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            mockingoose(Trip).toReturn(null, 'find'); // Mock failed trip insertion

            // Mock the validateUser function to throw an error


            const response = await request(app)
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
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            const mockUpdatedTrip = { ...mockTrip, successful: true }; // Mock an updated trip

            // Mock the Trip.updateOne function to update the trip
            //   jest.spyOn(Trip, 'updateOne').mockResolvedValue({ nModified: 1 });
            mockingoose(Trip).toReturn({ nModified: 1 }, 'updateOne'); // Mock failed trip insertion

            // Mock the Trip.findOne function to return the updated trip
            //   jest.spyOn(Trip, 'findOne').mockResolvedValue(mockUpdatedTrip);
            mockingoose(Trip).toReturn(mockUpdatedTrip, 'findOne'); // Mock failed trip insertion

            const response = await request(app)
                .put('/trips/success')
                .send({ data: { tripId: '12345', successful: true } });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip edited successfully');
            expect(response.body.trip.successful).toEqual(true);
        });

        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
                .put('/trips/success')
                .send({ data: { tripId: '12345', successful: true } });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });

        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            jest.spyOn(Trip, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
                .put('/trips/success')
                .send({ data: { tripId: '12345', successful: true } });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putTripSuccessful');
        });

    });


    describe('Request a Trip route', () => {


        it('should make a booking request successfully when valid data is provided', async () => {
            const mockTripUpdated = { ...mockTrip, seats: { available: 5 } }; // Mock a trip
            const mockUpdatedTrip = { ...mockTrip, passengerIDs: [{ bookingId: 'unique_booking_id' }] }; // Mock an updated trip
            const totalSum = 2 * Number(mockTrip.price); // Calculate the total sum

            jest.mock('../utils/userUtils', () => ({
                sendPushNotification: jest.fn(),
            }));


            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the Trip.updateOne function to update the trip
            jest.spyOn(Trip, 'updateOne').mockResolvedValue({ nModified: 1 });

            // Mock the Trip.findOne function to return the updated trip
            jest.spyOn(Trip, 'findOne').mockResolvedValue(mockUpdatedTrip);

            // Mock the User.updateOne function to update the user
            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            // Mock the User.findOne function to return the trip driver
            jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

            const response = await request(app)
                .put('/trips/request')
                .send({ data: { tripId: '12345', seats: 2 } });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip edited successfully');
            expect(response.body.trip).toEqual(mockUpdatedTrip);
            //   expect(uuidv4).toHaveBeenCalledTimes(1); // Ensure uuidv4 was called once
            expect(User.updateOne).toHaveBeenCalledWith(
                { userId: mockUser.userId },
                {
                    $push: { tripsAsPassengerIDs: '12345' },
                    $set: {
                        'credits.onHold': Number(mockUser.credits.onHold) + totalSum,
                        'credits.available': Number(mockUser.credits.available) - totalSum,
                    },
                }
            );
        });


        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
                .put('/trips/request')
                .send({ data: { tripId: '12345', seats: 2 } });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });

        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            jest.spyOn(Trip, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
                .put('/trips/request')
                .send({ data: { tripId: '12345', seats: 2 } });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putMakeRequest');
        });


    });


    describe('Add Review route', () => {


        it('should add a review successfully when valid data is provided', async () => {

            const mockDriver = { userId: 'driver123', driverRating: { totalReviews: 10, totalRating: 40 } }; // Mock a driver
            const mockTrip = { _id: 'trip123', passengerIDs: [{ userId: mockUser.userId, reviewed: false }] }; // Mock a trip
            const rating = 5; // Mock a rating

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });


            // Mock the User.findOne function to return the driver
            jest.spyOn(User, 'findOne').mockResolvedValue(mockDriver);

            // Mock the User.updateOne function to update the driver's rating
            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            // Mock the Trip.updateOne function to update the trip as reviewed
            jest.spyOn(Trip, 'updateOne').mockResolvedValue({ nModified: 1 });

            const response = await request(app)
                .put('/user/review/driverRating')
                .send({ data: { tripId: 'trip123', driverId: 'driver123', rating } });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('putAddReview Changed ');
            expect(User.updateOne).toHaveBeenCalledWith(
                { userId: 'driver123' },
                {
                    $set: {
                        'driverRating.totalReviews': 11,
                        'driverRating.totalRating': 45,
                    },
                }
            );
            expect(Trip.updateOne).toHaveBeenCalledWith(
                { _id: 'trip123', "passengerIDs.userId": mockUser.userId },
                {
                    $set: { "passengerIDs.$.reviewed": true },
                }
            );
        });

        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
                .put('/user/review/driverRating')
                .send({ data: { tripId: 'trip123', driverId: 'driver123', rating: 5 } });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });

        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });


            // Mock the User.findOne function to throw an error
            jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
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
            const response = await request(app)
                .get('/user')
                .send();

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });


    });

    describe('Add Car route', () => {


        it('should add a car successfully when valid data is provided', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });
            const mockUpdatedUser = { ...mockUser, cars: [mockCar1] }; // Mock an updated user with the added car

            // Mock the User.updateOne function to update the user's cars
            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            // Mock the User.findOne function to return the updated user
            jest.spyOn(User, 'findOne').mockResolvedValue(mockUpdatedUser);

            const response = await request(app)
                .put('/user/cars')
                .send(mockCar1);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Car added successfully');
            expect(response.body.car).toEqual(mockCar1);
        });

        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
                .put('/user/cars')
                .send(mockCar1);

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });

        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the User.updateOne function to throw an error
            jest.spyOn(User, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
                .put('/user/cars')
                .send(mockCar1);

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putCar');
        });
    });


    describe('Get User History route', () => {


        it('should get user history successfully when valid user is provided', async () => {
            jest.mock('../controllers/userController', () => ({
                getDriver: jest.fn(),
            }));
            const mockTrips = [mockTrip, mockTrip]; // Mock user trips

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the find functions to return user trips
            jest.spyOn(Trip, 'find').mockResolvedValue(mockTrips);

            const response = await request(app)
                .get('/user/history')
                .send();

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(mockTrips.length + mockUser.tripsAsDriverIDs.length);
        });


        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
                .get('/user/history')
                .send();

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });
        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });


            // Mock the find functions to throw an error
            jest.spyOn(Trip, 'find').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
                .get('/user/history')
                .send();

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in getHistory');
        });
    });

    describe('Add Trip as Driver route', () => {


        it('should add a trip as a driver successfully when valid data is provided', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the User.updateOne function to update the user's tripsAsDriverIDs
            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            const response = await request(app)
                .put('/user/trips/driver')
                .send({ _id: 'trip123' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip as Driver added successfully');
            expect(User.updateOne).toHaveBeenCalledWith(
                { userId: mockUser.userId },
                {
                    $push: { tripsAsDriverIDs: 'trip123' },
                }
            );

        })
        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
                .put('/user/trips/driver')
                .send({ _id: 'trip123' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });

        it('should handle errors and return 500 status if an internal error occurs', async () => {
            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });


            // Mock the User.updateOne function to throw an error
            jest.spyOn(User, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
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

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the User.updateOne function to update the user's available credits
            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            // Mock the User.findOne function to return the updated user
            jest.spyOn(User, 'findOne').mockResolvedValue({ ...mockUser, credits: { available: currentCredits + newCredits } });

            const response = await request(app)
                .put('/user/credits/available')
                .send({ amount: newCredits });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Available Credits Changed');
            expect(response.body.credits.available).toBe(currentCredits + newCredits);

        });

        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);


            const response = await request(app)
                .put('/user/credits/available')
                .send({ amount: 50 });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });

        it('should handle errors and return 500 status if an internal error occurs', async () => {
            const newCredits = 50; // Mock new credits to add

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the User.updateOne function to throw an error
            jest.spyOn(User, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
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

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the User.updateOne function to update the user's on-hold credits
            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            // Mock the User.findOne function to return the updated user
            jest.spyOn(User, 'findOne').mockResolvedValue({ ...mockUser, credits: { onHold: currentCredits + newCredits } });

            const response = await request(app)
                .put('/user/credits/hold')
                .send({ amount: newCredits });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('OnHold Credits Changed ');
            expect(response.body.credits.onHold).toBe(currentCredits + newCredits);
        });

        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);


            const response = await request(app)
                .put('/user/credits/hold')
                .send({ amount: 50 });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });

        it('should handle errors and return 500 status if an internal error occurs', async () => {

            const newCredits = 50; // Mock new credits to add

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });


            // Mock the User.updateOne function to throw an error
            jest.spyOn(User, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
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

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the User.updateOne function to update the user's earnings on-hold credits
            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            // Mock the User.findOne function to return the updated user
            jest.spyOn(User, 'findOne').mockResolvedValue({ ...mockUser, credits: { earningsOnHold: currentCredits + newCredits } });

            const response = await request(app)
                .put('/user/credits/earnings')
                .send({ amount: newCredits });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('earningsOnHold Credits Changed ');
            expect(response.body.credits.earningsOnHold).toBe(currentCredits + newCredits);
        });

        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
                .put('/user/credits/earnings')
                .send({ amount: 50 });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });

        it('should handle errors and return 500 status if an internal error occurs', async () => {
            const newCredits = 50; // Mock new credits to add

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the User.updateOne function to throw an error
            jest.spyOn(User, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
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

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the User.updateOne function to update the user's earnings to available credits
            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            // Mock the User.findOne function to return the updated user
            jest.spyOn(User, 'findOne').mockResolvedValue({ ...mockUser, credits: { earningsOnHold: currentOnHoldEarnings - totalCredits, available: currentAvailable + totalCredits } });

            const response = await request(app)
                .put('/user/credits/earningsToAvailable')
                .send({ data: { totalCredits } });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('putEarningsToAvailable Credits Changed ');
            expect(response.body.credits.earningsOnHold).toBe(currentOnHoldEarnings - totalCredits);
            expect(response.body.credits.available).toBe(currentAvailable + totalCredits);
        });

        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
                .put('/user/credits/earningsToAvailable')
                .send({ data: { totalCredits: 30 } });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe(false);
        });

        it('should handle errors and return 500 status if an internal error occurs', async () => {

            const totalCredits = 30; // Mock total credits to transfer

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            // Mock the User.updateOne function to throw an error
            jest.spyOn(User, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
                .put('/user/credits/earningsToAvailable')
                .send({ data: { totalCredits } });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putEarningsToAvailable');
        });
    });



    describe('Approve Passenger route', () => {


        it('should approve a passenger and update user credits successfully when valid data is provided', async () => {
            const totalCredits = 30; // Mock total credits
            const trip = mockTripWithId; // Assume the trip is valid

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            jest.spyOn(Trip, 'updateOne').mockResolvedValue({ nModified: 1 });

            jest.spyOn(User, 'findOne').mockResolvedValue({ ...passenger });

            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            jest.spyOn(User, 'findOne').mockResolvedValue({ ...mockUser, credits: { earningsOnHold: 100 } });

            const response = await request(app)
                .put('/user/trips/approve')
                .send({
                    data: {
                        tripId: trip._id,
                        passengerId: passenger.userId,
                        bookingId: passenger.bookingId,
                        totalCredits,
                    },
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip edited successfully');
            expect(Trip.updateOne).toHaveBeenCalledWith(
                { _id: trip._id, 'passengerIDs.bookingId': passenger.bookingId },
                { $set: { 'passengerIDs.$.status': 'Approved' } },
                { new: true }
            );
            expect(User.findOne).toHaveBeenCalledWith({ userId: passenger.userId });
        });

        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
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
            const trip = mockTripWithId; // Assume the trip is valid

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            jest.spyOn(Trip, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
                .put('/user/trips/approve')
                .send({
                    data: {
                        tripId: trip._id,
                        passengerId: passenger.userId,
                        bookingId: passenger.bookingId,
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
            const trip = mockTripWithId; // Assume the trip is valid
            const seats = 2; // Mock the number of seats previously booked by the passenger

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            jest.spyOn(Trip, 'findOne').mockResolvedValue({ ...trip, passengerIDs: [{ bookingId: passenger.bookingId, seats }] });

            jest.spyOn(Trip, 'updateOne').mockResolvedValue({ nModified: 1 });

            jest.spyOn(User, 'findOne').mockResolvedValue({ ...passenger });

            jest.spyOn(User, 'updateOne').mockResolvedValue({ nModified: 1 });

            const response = await request(app)
                .put('/user/trips/reject')
                .send({
                    data: {
                        tripId: trip._id,
                        passengerId: passenger.userId,
                        bookingId: passenger.bookingId,
                        totalCredits,
                    },
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trip edited successfully');
            expect(Trip.updateOne).toHaveBeenCalledWith(
                { _id: trip._id, 'passengerIDs.bookingId': passenger.bookingId },
                {
                    $set: { 'passengerIDs.$.status': 'Rejected' },
                    $inc: { 'seats.available': seats },
                }
            );
            expect(User.findOne).toHaveBeenCalledWith({ userId: passenger.userId });

        });

        it('should return an error if user validation fails', async () => {
            validateUserMock.mockResolvedValue(false);

            const response = await request(app)
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
            const trip = mockTripWithId; // Assume the trip is valid
            const seats = 2; // Mock the number of seats previously booked by the passenger

            validateUserMock.mockResolvedValue({ userId: '123456', user: mockUser });

            jest.spyOn(Trip, 'findOne').mockResolvedValue({ ...trip, passengerIDs: [{ bookingId: passenger.bookingId, seats }] });

            jest.spyOn(Trip, 'updateOne').mockRejectedValue(new Error('Internal error'));

            const response = await request(app)
                .put('/user/trips/reject')
                .send({
                    data: {
                        tripId: trip._id,
                        passengerId: passenger.userId,
                        bookingId: passenger.bookingId,
                        totalCredits,
                    },
                });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error in putRejectPassenger');
        });
    });

});
