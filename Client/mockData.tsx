import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react'
import * as Types from './types/types'

type MockDataType = {
    fakeCars: Types.TCar[];
    setFakeCars: React.Dispatch<React.SetStateAction<Types.TCar[]>>;
    mockUsers: Types.TUser[];
    setMockUsers: React.Dispatch<React.SetStateAction<Types.TUser[]>>;
    trips: Types.TTrip[];
    setTrips: React.Dispatch<React.SetStateAction<Types.TTrip[]>>;
}


const defaultMockDataContext: MockDataType = {
    fakeCars: [],
    setFakeCars: () => { },
    setMockUsers: () => { },
    mockUsers: [],
    setTrips: () => { },
    trips: []
};

const MockDataContext = createContext(defaultMockDataContext);

export const MockDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [mockUsers, setMockUsers] = useState<Types.TUser[]>([
        {
            id: '234',
            name: 'Erik L.',
            member_since: '23rd, Feb. 2023',
            email: 'erik@gmail.com',
            phoneNumber: '35326234112',
            password: '123456',
            cars: [
                {
                    id: "123",
                    model: 'Audi A4',
                    color: 'Black',
                    seats: 4,
                    licence_plate: 'SO-SI-6969'
                },
                {
                    id: "1234",
                    model: 'Audi A5',
                    color: 'Red',
                    seats: 2,
                    licence_plate: 'XXX-6969'
                },
            ],
            passengerRating: {
                totalReviews: 10,
                totalRating: 49,
                averageRating: 4.9
            },
            driverRating: {
                totalReviews: 5,
                totalRating: 10,
                averageRating: 2
            },
            tripsAsDriverIDs: ["123"],
            tripsAsPasangerIDs: [],
            credits:'20.00'
        }
    ])
    const [trips, setTrips] = useState<Types.TTrip[]>([
        {
            id: "123",
            departure: {
                city: "Berlin",
                address: "Stresemannstraße 123, 10963 Berlin, Germany",
                time: "12:30",
            },
            destination: {
                address: "C/ d'Àvila, 27, 08005 Barcelona, Spain",
                city: "Barcelona",
                time: "15:30",
            },
            date: "2023-11-28",
            total_time: "3:00",

            seats: {
                available: 2,
                total: 5,
            },
            services: {
                alcohol: false,
                childSeat: false,
                luggage: true,
                pets: true,
                smoking: true,
                comments: "here is a comment",
            },
            selectedCar: {
                id: "123",
                model: 'Audi A4',
                color: 'Black',
                seats: 4,
                licence_plate: 'SO-SI-6969'
            },
            price: "10.25",
            driverID: "234",
            passengersIDs: [],
            succesful: false
        }

    ])

    const [fakeCars, setFakeCars] = useState<Types.TCar[]>([
        // {
        //     id: "123",
        //     model: 'Audi A4',
        //     color: 'Black',
        //     seats: 4,
        //     licence_plates: 'SO-SI-6969'
        // },

    ])


    return (
        <MockDataContext.Provider value={{ fakeCars, setFakeCars, setMockUsers, mockUsers, setTrips, trips }} >
            {children}
        </MockDataContext.Provider>
    );
};

export const useMockData = () => {
    return useContext(MockDataContext);
}