import { TCar, TUser, TTrip, TTripNoId } from "../types";

// Mock data for TCar type
export const mockRegistrationData = {
    name: 'John Doe',
    email: '123123.doe@example.com',
    phoneNumber: '1234567890',
    password: 'password123',
    imageUrl: 'https://example.com/image.jpg',
    expoPushToken: 'expoPushToken123',
}

export const mockLoginData = {
    email: '123123.doe@example.com',
    password: 'password123',
}

export const mockImageData = {
    image: 'https://example.com/NEW.jpg',
}

export const mockNewPasswordData = {
    currentPassword: 'password123',
    newPassword: '12345678',
}




export const mockCar1: TCar = {
    _id: 'car1',
    model: 'Toyota Camry',
    color: 'Silver',
    seats: 5,
    licencePlate: 'ABC-123',
};

export const mockCar2: TCar = {
    _id: 'car2',
    model: 'Honda Civic',
    color: 'Blue',
    seats: 4,
    licencePlate: 'XYZ-789',
};

// Mock data for TUser type
export const mockUser: TUser = {
    _id: 'user1',
    userId: '123456',
    name: 'John Doe',
    memberSince: '2023-01-15',
    email: 'johndoe@example.com',
    phoneNumber: '123-456-7890',
    password: 'hashedPassword', // Replace with a hashed password
    cars: [mockCar1, mockCar2],
    passengerRating: {
        totalReviews: 10,
        totalRating: 45, // Replace with actual ratings
        averageRating: 4.5, // Replace with actual average rating
    },
    driverRating: {
        totalReviews: 15,
        totalRating: 60, // Replace with actual ratings
        averageRating: 4.0, // Replace with actual average rating
    },
    tripsAsDriverIDs: ['trip1', 'trip2'], // Replace with actual trip IDs
    tripsAsPasangerIDs: ['trip3', 'trip4'], // Replace with actual trip IDs
    credits: {
        available: '10000.00',
        onHold: '10.00',
        earningsOnHold: '30.00',
    },
};

export const mockTrip: TTripNoId = {
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
        _id: '656892fa5a7c2d83d9ee51d7', // Replace with the car ID
        model: 'Toyota Camry',
        color: 'Silver',
        licencePlate: 'ABC-123',
        seats: 5,
    },
    price: '50.00', // Price without currency symbol
    driverID: 'driver123', // Replace with the driver's ID
    passengerIDs: [
        {
            bookingId: 'booking1', // Replace with booking ID
            userId: 'user1', // Replace with passenger's ID
            name: 'Alice',
            status: 'Confirmed',
            seats: 1,
            reviewed: false
        },
        {
            bookingId: 'booking2', // Replace with booking ID
            userId: 'user2', // Replace with passenger's ID
            name: 'Bob',
            status: 'Confirmed',
            seats: 2,
            reviewed: false
        },
    ],
    successful: false,
};



export const mockTripWithId: TTrip = {
    _id: '1234567890', // Replace with a unique ID
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
        _id: '656892fa5a7c2d83d9ee51d7', // Replace with the car ID
        model: 'Toyota Camry',
        color: 'Silver',
        licencePlate: 'ABC-123',
        seats: 5,
    },
    price: '50.00', // Price without currency symbol
    driverID: 'driver123', // Replace with the driver's ID
    passengerIDs: [
        {
            bookingId: 'booking1', // Replace with booking ID
            userId: 'user1', // Replace with passenger's ID
            name: 'Alice',
            status: 'Confirmed',
            seats: 1,
            reviewed: false
        },
        {
            bookingId: 'booking2', // Replace with booking ID
            userId: 'user2', // Replace with passenger's ID
            name: 'Bob',
            status: 'Confirmed',
            seats: 2,
            reviewed: false
        },
    ],
    successful: false,
};

export const passenger = {
    bookingId: 'booking2', // Replace with booking ID
    userId: 'user2', // Replace with passenger's ID
    name: 'Bob',
    status: 'Confirmed',
    seats: 2,
    reviewed: false
}
