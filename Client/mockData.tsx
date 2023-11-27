export const mockDriver = {
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
}


export const trips = [
    {
        departure: {
            city: 'Berlin',
            address: 'Stresemannstraße 123c',
            time: '12:15'
        },
        destination: {
            city: 'Hamburg',
            address: 'Bornheide 9',
            time: '15:45'
        },
        trip: {
            total_time: '3:30',
            stops: [
                {
                    city: 'Lüneburg',
                    arrival_time: '14:45'
                }
            ],
        },
        driver: {
            name: 'Vladislav',
            rating: '2,3'
        },
        price: '18',
        seats: {
            available: 3,
            total: 5
        }
    },
    {
        departure: {
            city: 'Berlin',
            address: 'Stresemannstraße 123c',
            time: '12:15'
        },
        destination: {
            city: 'Hamburg',
            address: 'Bornheide 9',
            time: '15:45'
        },
        trip: {
            total_time: '3:30'
        },
        driver: {
            name: 'Erik',
            rating: '4,9'
        },
        price: '14.30',
        seats: {
            available: 1,
            total: 3
        }
    },
    {
        departure: {
            city: 'Berlin',
            address: 'Stresemannstraße 123c',
            time: '12:15'
        },
        destination: {
            city: 'Hamburg',
            address: 'Bornheide 9',
            time: '15:45'
        },
        trip: {
            total_time: '3:30'
        },
        driver: {
            name: 'Oguz',
            rating: '4,1'
        },
        price: '23',
        seats: {
            available: 1,
            total: 5
        }
    }
];
export const fakeCars = [
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


]




