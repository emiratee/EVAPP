import { StyleSheet, Text, View } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type Props = {
    onPress: any

}

const LocationSearch = (props: Props) => {
    // const [addressText, setAddressText] = useState('')
    const ref = useRef();


    return (

        <GooglePlacesAutocomplete
            // ref={ref}
            styles={{
                container: {
                    flex: 1,
                },
                textInputContainer: {
                    backgroundColor: 'transparent',
                },
                textInput: {
                    color: '#5d5d5d',
                    fontSize: 16,
                    height: 50,
                    width: '100%',
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: '#a8a8a8',
                },
            }

            }
            disableScroll={true}
            placeholder='Search'
            onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                // console.log(data, details);
                props.onPress(data.description);
                console.log(data, 'DATA')
                console.log(details, 'Details')

            }}
            query={{
                key: 'AIzaSyBKyJV9kEv1bofDeXIzMvp2UpDq0bHWSBM',
                language: 'en',
            }}
            enablePoweredByContainer={false}

        />

    )
}

export default LocationSearch

const styles = StyleSheet.create({
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#a8a8a8',
        // color: textColor
    },
})