import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from './apiService';
import * as types from '../types/types';



const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<types.TUser | null>(null);

    useEffect(() => {
        if (token) {
            getUser(token).then((data) => {
                setUser(data)
            })
        }
    }, [token])

    const login = async (token:string) => {
        try {
            await AsyncStorage.setItem('token', token)
            setToken(token);
        } catch (error) {
            console.error('Error storing token:', error);

        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token')
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Error removing token:', error)
        }
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                // value previously stored
                setToken(value);
            }
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
