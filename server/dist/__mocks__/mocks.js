"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passenger = exports.mockTripWithId = exports.mockTrip = exports.mockUser = exports.mockCar2 = exports.mockCar1 = exports.mockNewPasswordData = exports.mockImageData = exports.mockLoginData = exports.mockRegistrationData = void 0;
// Mock data for TCar type
exports.mockRegistrationData = {
    name: 'John Doe',
    email: '123123.doe@example.com',
    phoneNumber: '1234567890',
    password: 'password123',
    imageUrl: 'https://example.com/image.jpg',
    expoPushToken: 'expoPushToken123',
};
exports.mockLoginData = {
    email: '123123.doe@example.com',
    password: 'password123',
};
exports.mockImageData = {
    image: 'https://example.com/NEW.jpg',
};
exports.mockNewPasswordData = {
    currentPassword: 'password123',
    newPassword: '12345678',
};
exports.mockCar1 = {
    _id: 'car1',
    model: 'Toyota Camry',
    color: 'Silver',
    seats: 5,
    licencePlate: 'ABC-123',
};
exports.mockCar2 = {
    _id: 'car2',
    model: 'Honda Civic',
    color: 'Blue',
    seats: 4,
    licencePlate: 'XYZ-789',
};
// Mock data for TUser type
exports.mockUser = {
    _id: 'user1',
    userId: '123456',
    name: 'John Doe',
    memberSince: '2023-01-15',
    email: 'johndoe@example.com',
    phoneNumber: '123-456-7890',
    password: 'hashedPassword',
    cars: [exports.mockCar1, exports.mockCar2],
    passengerRating: {
        totalReviews: 10,
        totalRating: 45,
        averageRating: 4.5, // Replace with actual average rating
    },
    driverRating: {
        totalReviews: 15,
        totalRating: 60,
        averageRating: 4.0, // Replace with actual average rating
    },
    tripsAsDriverIDs: ['trip1', 'trip2'],
    tripsAsPasangerIDs: ['trip3', 'trip4'],
    credits: {
        available: '10000.00',
        onHold: '10.00',
        earningsOnHold: '30.00',
    },
};
exports.mockTrip = {
    // _id: '1234567890', // Replace with a unique ID
    departure: {
        country: 'USA',
        city: 'New York',
        address: '123 Main St',
        time: '08:00',
        date: '2023-12-15',
    },
    destination: {
        country: 'USA',
        city: 'Los Angeles',
        address: '456 Elm St',
        time: '16:00',
        date: '2023-12-16',
    },
    date: '2023-12-15',
    totalTime: '8 hours',
    seats: {
        available: 3,
        total: 5,
    },
    services: {
        smoking: false,
        childSeat: true,
        pets: false,
        alcohol: true,
        luggage: true,
        comments: 'No smoking allowed.',
    },
    car: {
        _id: '656892fa5a7c2d83d9ee51d7',
        model: 'Toyota Camry',
        color: 'Silver',
        licencePlate: 'ABC-123',
        seats: 5,
    },
    price: '50.00',
    driverID: 'driver123',
    passengerIDs: [
        {
            bookingId: 'booking1',
            userId: 'user1',
            name: 'Alice',
            status: 'Confirmed',
            seats: 1,
            reviewed: false
        },
        {
            bookingId: 'booking2',
            userId: 'user2',
            name: 'Bob',
            status: 'Confirmed',
            seats: 2,
            reviewed: false
        },
    ],
    successful: false,
};
exports.mockTripWithId = {
    _id: '1234567890',
    departure: {
        country: 'USA',
        city: 'New York',
        address: '123 Main St',
        time: '08:00',
        date: '2023-12-15',
    },
    destination: {
        country: 'USA',
        city: 'Los Angeles',
        address: '456 Elm St',
        time: '16:00',
        date: '2023-12-16',
    },
    date: '2023-12-15',
    totalTime: '8 hours',
    seats: {
        available: 3,
        total: 5,
    },
    services: {
        smoking: false,
        childSeat: true,
        pets: false,
        alcohol: true,
        luggage: true,
        comments: 'No smoking allowed.',
    },
    car: {
        _id: '656892fa5a7c2d83d9ee51d7',
        model: 'Toyota Camry',
        color: 'Silver',
        licencePlate: 'ABC-123',
        seats: 5,
    },
    price: '50.00',
    driverID: 'driver123',
    passengerIDs: [
        {
            bookingId: 'booking1',
            userId: 'user1',
            name: 'Alice',
            status: 'Confirmed',
            seats: 1,
            reviewed: false
        },
        {
            bookingId: 'booking2',
            userId: 'user2',
            name: 'Bob',
            status: 'Confirmed',
            seats: 2,
            reviewed: false
        },
    ],
    successful: false,
};
exports.passenger = {
    bookingId: 'booking2',
    userId: 'user2',
    name: 'Bob',
    status: 'Confirmed',
    seats: 2,
    reviewed: false
};
