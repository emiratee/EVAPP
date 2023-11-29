export type TCar = {
    _id: string,
    model: string,
    color: string,
    seats: number,
    licencePlate: string
}



export type TTrip = {
    _id: string,
    departure: {
        country: string,
        city: string,
        address: string,
        time: string
    },
    destination: {
        country: string,
        city: string,
        address: string,
        time: string
    },
    date: string,
    totalTime: string,
    seats: {
        available: number,
        total: number
    },
    services: {
        smoking: boolean,
        childSeat: boolean,
        pets: boolean,
        alcohol: boolean,
        luggage: boolean,
        comments?: string,
    }
    car: TCar,
    price: string,
    driverID: string,
    passengersIDs: string[],
    successful: boolean

}


export type TUser = {
    _id: string,
    name: string,
    memberSince: string,
    email: string,
    phoneNumber: string,
    password: string,
    cars: TCar[],
    passengerRating: {
        totalReviews: number,
        totalRating: number,
        averageRating: number
    },
    driverRating: {
        totalReviews: number,
        totalRating: number,
        averageRating: number
    },
    tripsAsDriverIDs: string[],
    tripsAsPasangerIDs: string[],
    credits: string

}

export type TCarNoId = Omit<TCar, '_id'>
export type TTripNoId = Omit<TTrip, '_id'>
export type TUserNoId = Omit<TUser, '_id'>