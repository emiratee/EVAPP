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
        time: string,
        date: string
    },
    destination: {
        country: string,
        city: string,
        address: string,
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
    car: TCar | TCarNoId,
    price: string,
    driverID: string,
    passengersIDs: {
        bookingId: string,
        userId: string,
        name: string,
        status: string,
        seats: number
    }[],
    successful: boolean
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
    cars: TCar[] | TCarNoId[],
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

  
export type TAuth = {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    user: TUser | null;
    setUser: React.Dispatch<React.SetStateAction<TUser | null>>;
};

export type TCarNoId = Omit<TCar, '_id'>
export type TTripNoId = Omit<TTrip, '_id'>
export type TUserNoId = Omit<TUser, '_id'>