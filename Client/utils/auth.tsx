import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from './apiService';
import { TUser, TAuth } from '../types/types';

const defaultAuthContext: TAuth = {
    token: null,
    setToken: () => { },
    login: async () => { },
    logout: async () => { },
    isAuthenticated: false,
    user: {
        _id: '',
        name: '',
        memberSince: '',
        email: '',
        phoneNumber: '',
        password: '',
        cars: [],
        passengerRating: {
            totalReviews: 0,
            totalRating: 0,
            averageRating: 0
        },
        driverRating: {
            totalReviews: 0,
            totalRating: 0,
            averageRating: 0
        },
        tripsAsDriverIDs: [],
        tripsAsPasangerIDs: [],
        credits: {
            available: '',
            onHold: '',
            earningsOnHold: ''
        }
    },
    setUser: () => { },
};

const AuthContext = createContext(defaultAuthContext);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<TUser | null>(null);

    useEffect(() => {
        (async () => {
            if (token) {
                const data = await getUser(token);
                setUser(data);
            }
        })();
    }, [token])

    const login = async (token: string): Promise<void> => {
        try {
            await AsyncStorage.setItem('token', token)
            setToken(token);
        } catch (error) {
            console.error('Error storing token:', error);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem('token')
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Error removing token:', error)
        }
    };

    const getData = async (): Promise<void> => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) setToken(value);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getData();
    }, []);


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

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};
