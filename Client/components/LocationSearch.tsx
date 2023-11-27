import { StyleSheet, Text, View } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type Props = {}

const LocationSearch = (props: Props) => {
    // const [addressText, setAddressText] = useState('')
    const ref = useRef();

    useEffect(() => {
        // ref.current?.setAddressText('Some Text');

    }, []);


    return (

        <GooglePlacesAutocomplete
            // ref={ref}
            placeholder='Search'
            onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
            }}
            query={{
                // key: 'AIzaSyBKyJV9kEv1bofDeXIzMvp2UpDq0bHWSBM',
                language: 'en',
            }}
        />

    )
}

export default LocationSearch

const styles = StyleSheet.create({})