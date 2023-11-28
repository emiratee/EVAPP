import React from 'react';
import TripCard from '../../components/TripCard/TripCard';
import { useRoute } from '@react-navigation/native';
export default function t3() {
    const { formData } = useRoute().params
    return (
        <TripCard formData={formData} />
    );
}