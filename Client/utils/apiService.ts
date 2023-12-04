import { Alert } from "react-native";
import * as types from '../types/types'
//const BASE_URL = process.env.ATLAR_URL || 'https://evapp.vercel.app/';
const BASE_URL = process.env.ATLAR_URL || 'http://127.0.0.1:3000'; 
const checkResponse = (response: Response): void => {
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
};

const getFilteredTrips = async (data: types.TTrip_search, token: string) => {
    try {
        if (!data.destination) {
            const response = await fetch(`${BASE_URL}/trips?departureCountry=${data.departure.country}&departureCity=${data.departure.city}&date=${data.date}&seats=${data.seats}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`
                }
            });
            return await response.json();

        } else {
            const response = await fetch(`${BASE_URL}/trips?departureCountry=${data.departure.country}&departureCity=${data.departure.city}&destinationCountry=${data.destination?.country}&destinationCity=${data.destination?.city}&date=${data.date}&seats=${data.seats}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`
                }
            });
            return await response.json();
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getDriver = async (driverId: string) => {
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

const addCar = async (data: types.TCarNoId, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/cars`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
            },
            body: JSON.stringify(data),
        });
        console.log(response)
        checkResponse(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addNewTrip = async (data: types.TTripNoId, token: string) => {
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

const putTripsAsDriver = async (data: { _id: string }, token: string) => {
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

const postRegister = async (data: types.TRegisterForm) => {
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


const updateAccount = async (data: { currentPassword?: string, newPassword?: string, image?: string }, token: string) => {
    try {
        const { currentPassword, newPassword, image } = data;
        const response = await fetch(`${BASE_URL}/user/account/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                image
            })
        })
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const postChat = async (driverId: string, passengerId: string, token: string) => {
    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dzfbxhrtf/upload", {
            method: "POST",
            body: data,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const cloudinaryData = await response.json();

        return cloudinaryData.secure_url;
    } catch (err) {
        console.error('An Error Occurred While Uploading:', err);
        Alert.alert('An Error Occurred While Uploading');
        throw err;
    }
}

const cloudinaryUpload = async (data): Promise<string> => {
    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dzfbxhrtf/upload", {
            method: "POST",
            body: data,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const cloudinaryData = await response.json();

        return cloudinaryData.secure_url;
    } catch (err) {
        console.error('An Error Occurred While Uploading:', err);
        Alert.alert('An Error Occurred While Uploading');
        throw err;
    }
}

async function sendPushNotification(expoPushToken: string): Promise<void> {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

}

const getAllChats = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/chats`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getChat = async (chatId: string, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/chats/${chatId}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const postMessage = async (chatId: string, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/chats/${chatId}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            }
        });
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
    updateAccount,
    sendPushNotification,
    postChat,
    getAllChats,
    getChat,
    postMessage,
    cloudinaryUpload
}