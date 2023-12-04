import { useRoute } from '@react-navigation/native';
import React from 'react';
import TripInfoModalScreen from '../components/TripInfo/TripInfo';
import * as types from '../types/types'

export default function ModalScreen() {
    const { trip, driver } = useRoute().params as { trip: types.TTrip; driver: types.TUser };

    return (
        <TripInfoModalScreen trip={trip} driver={driver} />
    );
}