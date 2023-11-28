const BASE_URL = process.env.ATLAR_URL || 'http://127.0.0.1:3000'; //not working

const getFilteredTrips = async (departure, destination, date, seats): Promise<any> => {     
    try {
        const response = await fetch(`${BASE_URL}/trips?departureCountry=${departure.country}&departureCity=${departure.city}&destinationCountry=${destination.country}&destinationCity=${destination.city}&date=${date}&seats=${seats}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getDriver = async(driverId): Promise<any> => {
    try {
        const response = await fetch(`${BASE_URL}/user/account/${driverId}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export {
    getFilteredTrips,
    getDriver
}