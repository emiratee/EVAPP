const BASE_URL = process.env.ATLAR_URL; //not working

const getFilteredTrips = async (departure, destination, date, seats): Promise<any> => {     
    try {
        const response = await fetch(`http://127.0.0.1:3000/trips?departureCountry=${departure.country}&departureCity=${departure.city}&destinationCountry=${destination.country}&destinationCity=${destination.city}&date=${date}&seats=${seats}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export {
    getFilteredTrips
}