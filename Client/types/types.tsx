export type TCar = {
    id: string,
    model: string,
    color: string,
    seats: number,
    licence_plate: string
}
export type TTrip = {
    id: string,
    departure: {
        city: string,
        address: string,
        time: string
    },
    destination: {
        city: string,
        address: string,
        time: string
    },
    date: string,
    total_time: string,
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
    selectedCar: TCar,
    price: string,
    driverID: string,
    passengersIDs: string[],
    succesful: boolean

}
export type TUser = {
    id: string,
    name: string,
    member_since: string,
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