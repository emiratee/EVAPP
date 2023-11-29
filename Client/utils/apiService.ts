const BASE_URL = process.env.ATLAR_URL || 'http://127.0.0.1:3000'; //not working
const checkResponse = (response: Response): void => {
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
};

const getFilteredTrips = async (departure, destination, date, seats): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/trips?departureCountry=${departure.country}&departureCity=${departure.city}&destinationCountry=${destination.country}&destinationCity=${destination.city}&date=${date}&seats=${seats}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getDriver = async (driverId): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/user/account/${driverId}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getUser = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/account`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            }
        });
        checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addCar = async (data, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/account/cars`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
            },
            body: JSON.stringify(data),
        });
        checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addNewTrip = async (data, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/trip/create`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
            },
            body: JSON.stringify(data),
        });
        checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const putTripsAsDriver = async (data, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/account/tripsAsDriver`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
            },
            body: JSON.stringify(data),
        });
        checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export {
    getFilteredTrips,
    getDriver,
    getUser,
    addCar,
    addNewTrip,
    putTripsAsDriver
}