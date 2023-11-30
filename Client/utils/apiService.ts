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
        const response = await fetch(`${BASE_URL}/user/${driverId}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getUser = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user`, {
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
        const response = await fetch(`${BASE_URL}/user/cars`, {
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
        const response = await fetch(`${BASE_URL}/user/trips/driver`, {
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

const postRegister = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/user/account/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        checkResponse(response);
        return await response.json();

    } catch (error) {
        console.log(error)
        throw error;
    }
}

const postLogin = async (email: string, password: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/account/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        //checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getHistory = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/history`, {
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

const putAvailableCredits = async (amount: String, token: String) => {
    try {
        const response = await fetch(`${BASE_URL}/user/credits/available`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ amount })
        })
        //checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const putApproveTrip = async (data, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/trips/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ data })
        })
        //checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
const putRejectTrip = async (data, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/trips/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ data })
        })
        //checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const putRequestTrip = async (data, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/trips/request`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ data })
        })
        //checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const uploadImage = async (data: any) => {
    try {


        console.log("DAta", data)
        const response = await fetch(`${BASE_URL}/user/image/upload`, {
            method: 'POST',
            body: data,
        });
        checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateAccount = async (data, token: string) => {
    try {
        const { currentPassword, newPassword} = data;
        const response = await fetch(`${BASE_URL}/user/account/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ 
                currentPassword,
                newPassword
             })
        })
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
    putTripsAsDriver,
    postRegister,
    postLogin,
    putAvailableCredits,
    getHistory,
    putApproveTrip,
    putRejectTrip,
    putRequestTrip,
    uploadImage,
    updateAccount
}