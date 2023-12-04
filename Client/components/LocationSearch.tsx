import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';
import * as types from '../types/types'

type Props = {
    onPress: React.Dispatch<React.SetStateAction<types.TDeparture | types.TDestination | null>>
}

const LocationSearch = (props: Props) => {

    return (
        <GooglePlacesAutocomplete
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
                    const address = details.formatted_address;
                    let city = details.address_components.find(component =>
                        component.types.includes("locality")
                    )?.long_name;
                    let country = details.address_components.find(component =>
                        component.types.includes("country")
                    )?.long_name || "";
                    if (!city) {
                        const addressParts = address.split(',');
                        city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : undefined || "";
                    }
                    props.onPress({ address, city, country });
                }
            }}
            query={{
                key: GOOGLE_MAPS_API_KEY,
                language: 'en',
            }}
            enablePoweredByContainer={false}

        />

    )
}

export default LocationSearch