import React, { useEffect, useState } from 'react';
import { Text, View, Animated, Easing, StyleSheet } from 'react-native';


const LocationInformation = ({ trip }) => {
    const [lineAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        setTimeout(() => {
            animateLine();
        }, 250);
    }, []);

    const animateLine = () => {
        Animated.timing(lineAnimation, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false
        }).start();
    }

    const lineHeight = lineAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 120],
    });

    return (
        <View style={styles.locationContainer}>
            <View style={styles.timeContainer}>
                <View>
                    <Text style={styles.time}>{trip.departure.time}</Text>
                </View>
                <View>
                    <Text style={styles.totalTime}>{`${trip.totalTime}h`}</Text>
                </View>
                <View>
                    <Text style={styles.time}>{trip.destination.time}</Text>
                </View>
            </View>
            <View style={styles.dotContainer}>
                <View style={styles.dot}>
                    <Animated.View style={[styles.line, { height: lineHeight }]}></Animated.View>
                </View>
                <View style={styles.dot}></View>
            </View>
            <View style={styles.addressContainer}>
                <View style={styles.mainContainer}>
                    <Text style={styles.address}>{trip.departure.address}</Text>
                    <Text style={styles.city}>{trip.departure.city}</Text>
                </View>
                <View style={styles.mainContainer}>
                    <Text style={styles.address}>{trip.destination.address}</Text>
                    <Text style={styles.city}>{trip.destination.city}</Text>
                </View>
            </View>
        </View>
    )
}

export default LocationInformation;

const styles = StyleSheet.create({
    horizontalLine: {
        backgroundColor: '#000',
        width: '99%',
        alignSelf: 'center',
        height: 1,
    },
    locationContainer: {
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '95%',
        height: 175,
        position: 'relative',
        borderColor: '#a8a8a8',
        borderRadius: 15,
        padding: 10,
        margin: 10,
        marginBottom: 10
    },
    timeContainer: {
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: 2.5
    },
    dotContainer: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        height: '95%',
        paddingTop: 10,
        paddingHorizontal: 15
    },
    addressContainer: {
        flex: 1,
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    mainContainer: {
        flexDirection: 'column',
    },
    city: {
        fontSize: 14,
        fontWeight: '400'
    },
    address: {
        fontSize: 18,
        fontWeight: '600'
    },
    time: {
        fontSize: 16,
        fontWeight: '200'
    },
    totalTime: {
        fontSize: 15,
        fontWeight: '300',
    },
    dot: {
        backgroundColor: '#000',
        width: 12,
        height: 12,
        borderRadius: 50,
    },
    line: {
        position: 'absolute',
        backgroundColor: '#000',
        width: 6,
        height: 120,
        top: 10,
        bottom: 0,
        left: 3,
        zIndex: 999
    },
});