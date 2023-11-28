import React, { useEffect, useState } from 'react';
import TripCard from '../../components/TripCard/TripCard';
import { useRoute } from '@react-navigation/native';

export default function TripCardRedirect() {
    const route = useRoute();
    const [response, setResponse] = useState(null);

    useEffect(() => {
        if (route.params && route.params.response) {
            setResponse(route.params.response);
        }
    }, [route.params]);

    if (!response) {
        return null; // Or loading indicator while waiting for response
    }

    return <TripCard response={response} />;
}
