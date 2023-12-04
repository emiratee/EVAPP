import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from 'react-native-wheel-pick';
import Bill from '../../Bill';
import { putRequestTrip } from '../../../utils/apiService';
import { useAuth } from '../../../utils/auth';
import * as types from '../../../types/types'

type Props = {
    trip: types.TTrip,

}
const Request = ({ trip }: Props) => {
    const { user, token } = useAuth()

    const [price, setPrice] = useState<string>(trip.price);
    const [isPickerVisible, setIsPickerVisible] = useState<boolean>(true);
    const [text, setText] = useState<string>(`${parseFloat(price).toFixed(2)}€`);
    const [seats, setSeats] = useState<number>(1);
    const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(true);

    const handlePriceChange = (value: string) => {
        const number: number = parseFloat(value);
        const price: number = trip && Number((Number(trip.price) * number).toFixed(2));
        setPrice(price.toString());
        setText(`${price.toFixed(2)}€`);
        setSeats(number);
    }

    const createPickerDataArray = () => {
        return Array.from({ length: trip.seats.total }, (_, index) => index < trip.seats.available ? (index + 1).toString() : '').slice(0, trip.seats.available);
    }



    //TODO refactor button to be 2 diff buttons
    const [secondClick, setSecondClick] = useState(false)


    const handleButtonClick = () => {
        // additional logic to execute when the button is clicked
        if (!secondClick) {
            user && setHasEnoughCredits(user.credits.available >= price);
            setIsPickerVisible(false);
            setText('Send booking request');
            setSecondClick(!secondClick)

        } else {
            const formData = {
                tripId: trip._id,
                seats: seats
            }
            token && putRequestTrip(formData, token)
        }
    }

    return (
        <View style={request_styles.container}>
            <TouchableOpacity style={
                [request_styles.buttonContainer,
                !isPickerVisible && { width: '95%', marginLeft: '2.5%', },
                hasEnoughCredits ? {} : request_styles.disabledButton,
                ]}
                onPress={handleButtonClick}
                disabled={!hasEnoughCredits}
            >
                <View style={request_styles.button}>
                    <Text style={request_styles.buttonText}>{text}</Text>
                </View>
            </TouchableOpacity>

            {!isPickerVisible && (<Bill trip={trip} price={Number(price)} seats={seats} setIsPickerVisible={setIsPickerVisible} hasEnoughCredits={hasEnoughCredits} />)}

            {isPickerVisible && (<Picker
                style={request_styles.picker}
                selectedValue='1'
                pickerData={createPickerDataArray()}
                onValueChange={(value: string) => { handlePriceChange(value) }}
                itemStyle={request_styles.pickerItem}
            />)}
        </View>
    )
}

export default Request;

const request_styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
        width: '100%',
        height: 75,
        position: 'absolute',
        bottom: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 15,
        padding: 10,
        margin: 10
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '75%',
        height: '100%',
        borderColor: '#a8a8a8',
        borderRadius: 10,
        backgroundColor: '#000'
    },
    button: {
        // backgroundColor: '#000',
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    disabledButton: {
        backgroundColor: '#b0aeae',
    },
    picker: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        width: '20%',
        height: '100%'
    },
    pickerItem: {
        fontSize: 20,
        height: 50,
        color: 'black',
        textAlign: 'center',
    }
});