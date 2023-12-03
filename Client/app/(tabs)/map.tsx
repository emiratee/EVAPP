import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';

const Map = ({ departure, destination }) => {

    const [locationA, setLocationA] = useState({ latitude: 0, longitude: 0 });
    const [locationB, setLocationB] = useState({ latitude: 0, longitude: 0 });

    Geocoder.init('AIzaSyBKyJV9kEv1bofDeXIzMvp2UpDq0bHWSBM');

    const getCoordinates = async (locationName) => {
        try {
            const response = await Geocoder.from(locationName);
            const { lat, lng } = response.results[0].geometry.location;
            return { latitude: lat, longitude: lng };

        } catch (error) {
            console.error('Error getting coordinates:', error);
            return { latitude: 0, longitude: 0 };
        }
    }

    useEffect(() => {
        const fetchCoordinates = async () => {
            const coordA = await getCoordinates(departure);
            const coordB = await getCoordinates(destination);

            setLocationA(coordA);
            setLocationB(coordB);
        };

        fetchCoordinates();
    }, [departure, destination]);

    const mapViewRef = useRef(null);

    useEffect(() => {
        // Check if both locations are available
        if (locationA.latitude && locationB.latitude && mapViewRef.current) {
          const coordinates = [locationA, locationB];
    
          mapViewRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // Adjust padding as needed
            animated: true,
          });
        }
      }, [locationA, locationB]);



    return (
        locationA.latitude !== 0 && locationB.latitude !== 0 && <View>
            <MapView
                ref={mapViewRef}
                style={styles.map}
                initialRegion={{
                    latitude: locationA.latitude,
                    longitude: locationA.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}

            >
                <Marker
                    coordinate={locationA}
                    title={departure}
                    description={`Lat: ${locationA.latitude}, Long: ${locationA.longitude}`}
                />
                <Marker
                    coordinate={locationB}
                    title={destination}
                    description={`Lat: ${locationB.latitude}, Long: ${locationB.longitude}`}
                />

                <MapViewDirections
                    origin={locationA}
                    destination={locationB}
                    apikey={'AIzaSyBKyJV9kEv1bofDeXIzMvp2UpDq0bHWSBM'}
                    strokeWidth={3}
                    strokeColor="hotpink"
                />

            </MapView>
        </View>
    )
}

export default Map

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%', 
        height: 300,  
        zIndex: 1,
    },
})