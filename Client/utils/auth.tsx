import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from './apiService';
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => {
        if (token) {
            getUser(token).then((data) => {
                setUser(data)
            })

        }
    }, [token])
    const login = (jwtToken) => {
        AsyncStorage.setItem('jwtToken', jwtToken)
            .then(() => {
                setToken(jwtToken);
            })
            .catch((error) => {
                console.error('Error storing JWT token:', error);
            });
    };

    const logout = () => {
        // Remove the JWT token from AsyncStorage
        AsyncStorage.removeItem('jwtToken')
            .then(() => {
                setToken(null);
            })
            .catch((error) => {
                console.error('Error removing JWT token:', error);
            });
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('jwtToken');
            if (value !== null) {
                // value previously stored
                setToken(value);
            }
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        // logout()
        getData();
    }, [])


    const isAuthenticated = !!token;

    const value = {
        token,
        setToken,
        login,
        logout,
        isAuthenticated,
        user,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
