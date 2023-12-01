export type TTrip = {
    _id?: string;
    departure: {
        country: string;
        city: string;
        address: string;
        time: string;
    };
    destination: {
        country: string;
        city: string;
        address: string;
        time: string;
    };
    date: string;
    totalTime: string;
    seats: {
        available: number;
        total: number;
    };
    services: {
        smoking: boolean;
        childSeat: boolean;
        pets: boolean;
        alcohol: boolean;
        luggage: boolean;
        comments?: string;
    };
    car: [];
    price: string;
    driverID: string;
    passengerIDs: {
        bookingId: string;
        userId: string;
        name: string;
        status: string;
        seats: number;
    }[];
    successful: boolean;
    __v?: string;
}