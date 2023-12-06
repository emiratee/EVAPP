import { StyleSheet, TextInput, Dimensions, TouchableOpacity, Alert, Text, View } from 'react-native'
import React, { useState } from 'react'
import * as icons from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { addCar } from '../utils/apiService';
import { useAuth } from '../utils/auth';
import * as types from '../types/types'
import COLORS from '../COLORS';
type Props = {
    setAddNewCar: any,
    setAddCarSnackBar: any
}

const AddNewCar = (props: Props) => {
    const [newModel, setNewModel] = useState<string>('')
    const [newColor, setNewColor] = useState<string>('')
    const [newLicencePlates, setNewLicencePlates] = useState<string>('')
    const [newNumberOfSeats, setNewNumberOfSeats] = useState<number>(1)

    const { token, setUser, user } = useAuth()

    return (
        user && token && <View style={{ width: '90%' }}>
            <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>Add New Car</Text>


            <View style={styles.parameters}>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.FontAwesome5 name='car' size={24} color={COLORS.iconColor} />
                        <Text>Model: </Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        editable
                        onChangeText={text => setNewModel(text)}
                        value={newModel}
                        placeholder="Type here..."
                        placeholderTextColor="#838383"
                        testID="model-input" 

                    />
                </View>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.Ionicons name='color-fill' size={24} color={COLORS.iconColor} />
                        <Text>Color: </Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        editable
                        onChangeText={text => setNewColor(text)}
                        value={newColor}
                        placeholder="Type here..."
                        placeholderTextColor="#838383"
                        testID="color-input" 
                    />
                </View>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.Ionicons name='documents' size={24} color={COLORS.iconColor} />
                        <Text>Licence Plates: </Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        editable
                        onChangeText={text => setNewLicencePlates(text)}
                        value={newLicencePlates}
                        placeholder="Type here..."
                        placeholderTextColor="#838383"
                        testID="licence-plates-input"
                    />
                </View>

                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.Ionicons name="ios-people" size={24} color={COLORS.iconColor} />
                        <Text>Number of seats: </Text>
                    </View>
                    <RNPickerSelect
                        onValueChange={(value) => { setNewNumberOfSeats(value) }}
                        style={{
                            inputIOS: styles.input,
                            inputAndroid: styles.input,
                        }}
                        placeholder={{
                            label: '1',
                            value: 1,
                        }}
                        items={[
                            { label: '2', value: 2 },
                            { label: '3', value: 3 },
                            { label: '4', value: 4 },
                            { label: '5', value: 5 },
                            { label: '6', value: 6 },
                        ]}
                    />
                </View>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                        if (newModel && newColor && newLicencePlates && newNumberOfSeats) {

                            const formData: types.TCarNoId = {
                                model: newModel,
                                color: newColor,
                                licencePlate: newLicencePlates,
                                seats: newNumberOfSeats,
                            }
                            addCar(formData, token).then((data: { car: types.TCar }) => {
                                props.setAddNewCar(false);
                                setUser((user: types.TUser | null) => (
                                    { ...user!, cars: [...user?.cars || [], data.car] }
                                ))
                            })
                            props.setAddCarSnackBar(true)
                        } else {
                            Alert.alert('Missing fields', 'Please fill in all mandatory fields');
                        }

                    }}
                >
                    <Text style={{color: '#fff', fontSize: 16}}>Add a car</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default AddNewCar
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    input: {
        height: 50,
        width: '100%',
        // borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#a8a8a8',
        backgroundColor: COLORS.inputFields,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    parameter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderColor: '#a8a8a8'
    },
    parameters: {
        gap: 5,
        borderRadius: 10,
        borderColor: '#a8a8a8',
        padding: 5,
        marginBottom: 10,
        width: windowWidth * 0.8
    },
    btn: {
        backgroundColor: COLORS.buttonBackground,
        alignItems: 'center',
        padding: 20,
        marginTop: 10,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2
    },
})