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
            textInputProps={{
                placeholderTextColor: '#838383',
              }}
            disableScroll={true}
            placeholder='Search'
            fetchDetails={true}
            onPress={(data, details = null) => {
                if (details) {
                    // Extracting address and city from the details
                    const address = details.formatted_address;
                    let city = details.address_components.find(component =>
                        component.types.includes("locality")
                    )?.long_name;

                    let country = details.address_components.find(component =>
                        component.types.includes("country")
                    )?.long_name;

                    if (!city) {
                        const addressParts = address.split(',');
                        city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : undefined;
                    }


                    props.onPress({ address, city , country});

                }


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