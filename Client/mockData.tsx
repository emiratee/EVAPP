import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react'

type MockDataType = {
    fakeCars: any;
    setFakeCars: any;
    setMockDriver: any;
    mockDriver: any;
    setTrips: any;
    trips: any;
}


const defaultMockDataContext: MockDataType = {
    fakeCars: undefined,
    setFakeCars: undefined,
    setMockDriver: undefined,
    mockDriver: undefined,
    setTrips: undefined,
    trips: undefined
};

const MockDataContext = createContext(defaultMockDataContext);

export const MockDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [mockDriver, setMockDriver] = useState({
        account: {
            name: 'Erik L.',
            member_since: '23rd, Feb. 2023'
        },
        trips: {
            total: 31
        },
        rating: {
            total: 29,
            average: 4.9
        },
        car: {
            model: 'Audi A4',
            color: 'Black',
            seats: 4,
            number_plate: 'SO-SI-6969'
        },
        services: {
            smoking: false,
            child_seat: false,
            pets: false,
            alcohol: false,
            luggage: true,
            comment: 'I like driving under influence' //max 90
        }
    })
    const [trips, setTrips] = useState([
        {
            arrivalTime: "15:30",
            date: "2023-11-28",
            departure:  {
              address: "Stresemannstraße 123, 10963 Berlin, Germany",
              city: "Berlin",
              time: "12:30",
            },
            departureTime: "12:30",
            destination:  {
              address: "C/ d'Àvila, 27, 08005 Barcelona, Spain",
              city: "Barcelona",
              time: "15:30",
            },
            driver:  {
              name: "Vladislav",
              rating: "2,3",
            },
            id: 0.231312,
            price: "10",
            seats:  {
              available: 6,
              total: 5,
            },
            selectedCar:  {
              color: "Red",
              id: 1,
              licence_plates: "XXX-777",
              model: "Audi A4",
              seats: 5,
            },
            services:  {
              alcoholToggled: false,
              childSeatToggled: false,
              comments: "here is a comment",
              luggageToggled: true,
              petsToggled: true,
              smokingToggled: true,
            },
            trip:  {
              total_time: "3:00",
            },
          }
          
    ])

    const [fakeCars, setFakeCars] = useState([
        {
            id: 1,
            model: 'Audi A4',
            color: 'Red',
            seats: 5,
            licence_plates: 'XXX-777',
        },
        {
            id: 2,
            model: 'Audi A2',
            color: 'Purple',
            seats: 5,
            licence_plates: 'YYY-777',
        },
        {
            id: 3,
            model: 'Audi A6',
            color: 'Black',
            seats: 5,
            licence_plates: 'XXX-778',
        }


    ])


    return (
        <MockDataContext.Provider value={{ fakeCars, setFakeCars, setMockDriver, mockDriver, setTrips, trips }} >
            {children}
        </MockDataContext.Provider>
    );
};

export const useMockData = () => {
    return useContext(MockDataContext);
}