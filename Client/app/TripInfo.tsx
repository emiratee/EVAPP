import { useRoute } from '@react-navigation/native';
import React from 'react';
import TripInfoModalScreen from '../components/TripInfo/TripInfo';

export default function ModalScreen() {
    const { trip, driver } = useRoute().params;

    return (
        <TripInfoModalScreen trip={trip} driver={driver} />
    );
}