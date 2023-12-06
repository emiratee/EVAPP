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
        address?: string,
        time: string,
        date: string
    },
    destination: {
        country: string,
        city: string,
        address?: string,
        time: string,
        date: string
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
    passengerIDs: TPassengerIDs[],
    successful: boolean
}

export type TPassengerIDs = {
    bookingId: string,
    userId: string,
    name: string,
    status: string,
    seats: number,
    reviewed: boolean
}

export type TUser = {
    _id: string,
    userId: string,
    name: string,
    expoPushToken?: string,
    memberSince: string,
    email: string,
    imageUrl?: string,
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
    credits: {
        available: string,
        onHold: string,
        earningsOnHold: string,
    }

}

export type TDeparture = {
    country: string,
    city: string,
    address?: string,
    time?: string,
    date?: string
}

export type TDestination = {
    country: string,
    city: string,
    address?: string,
    time?: string,
    date?: string
}


export type TTrip_search = {
    departure: TDeparture,
    destination?: TDestination,
    date: string,
    seats: number
}

export type TRegisterForm = {
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    imageUrl?: string,
    expoPushToken?: string
}

export type TImageFormData = {
    append: (name: string, value: any, fileName?: string) => void,
}

export type TCarNoId = Omit<TCar, '_id'>
export type TTripNoId = Omit<TTrip, '_id'>
export type TUserNoId = Omit<TUser, '_id'>