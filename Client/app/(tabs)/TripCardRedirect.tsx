import React, { useEffect, useState } from 'react';
import TripCard from '../../components/TripCard/TripCard';
import { useRoute } from '@react-navigation/native';
import * as types from '../../types/types'

export default function TripCardRedirect() {
    const route = useRoute();
    const [response, setResponse] = useState<{
        trips: {
            trip: types.TTrip,
            driver: types.TUser
        }[]
    } | null>(null);

    useEffect(() => {
        if (route.params && 'response' in route.params) {
            setResponse(route.params.response as typeof response);
        }
    }, [route.params]);

    if (!response) {
        return null; // Or loading indicator while waiting for response
    }

    return <TripCard response={response} />;
}
