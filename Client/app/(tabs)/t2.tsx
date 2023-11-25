import { FlatList, ScrollView, StyleSheet, TouchableOpacity, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Switch, useColorScheme, TextInput } from 'react-native'
import * as icons from '@expo/vector-icons';
import CarPreview from '../../components/CarPreview';
import { Text, View } from '../../components/Themed';
import { API_URL } from '@env'


type Props = {}

const t2 = (props: Props) => {

    const [seatPrice, setSeatPrice] = useState("")

    // console.log(API_URL)

    const [smokingToggled, setSmokingToggled] = useState<boolean>(false)
    const [childSeatToggled, setChildSeatToggled] = useState<boolean>(false)
    const [petsToggled, setPetsToggled] = useState<boolean>(false)
    const [alcoholToggled, setAlcoholToggled] = useState<boolean>(false)
    const [luggageToggled, setLuggageToggled] = useState<boolean>(false)
    const [commentsValue, setCommentsValue] = useState<string>('')
    const [selectedCar, setSelectedCar] = useState<any>(null)


    const iconColor = useColorScheme() === 'light' ? 'black' : 'white'

    const styles = getDynamicStyles(iconColor);
    const ab = API_URL
    console.log(API_URL)
    const fakeCars = [
        {
            id: 1,
            model: 'Audi A4',
            color: 'Red',
            seats: '5',
            licence_plates: 'XXX-777',
        },
        {
            id: 2,
            model: 'Audi A2',
            color: 'Purple',
            seats: '5',
            licence_plates: 'YYY-777',
        },
        {
            id: 3,
            model: 'Audi A6',
            color: 'Black',
            seats: '5',
            licence_plates: 'XXX-778',
        }


    ]
    const handlePriceChange = (text) => {
        let newText = text.replace(/,/g, '.');

        // Check if the newText has more than one dot
        const splitText = newText.split('.');
        if (splitText.length > 2) {
            // If more than one dot, remove the last entered character
            newText = newText.slice(0, -1);
        }

        // Allow only two decimal places
        const formattedInput = newText.replace(/(\.\d{2})\d+/, '$1');
        setSeatPrice(formattedInput);
    }

    return (


        <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            style={styles.container}
        >
            <View style={styles.parameters}>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.MaterialCommunityIcons name='smoking' size={24} color={iconColor} />
                        <Text>Smoking</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setSmokingToggled(!smokingToggled) }}
                        value={smokingToggled}
                    />
                </View>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.MaterialCommunityIcons name='car-child-seat' size={24} color={iconColor} />
                        <Text>Child Seat</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setChildSeatToggled(!childSeatToggled) }}
                        value={childSeatToggled}
                    />
                </View>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.MaterialIcons name='pets' size={24} color={iconColor} />
                        <Text>Pets</Text>
                    </View>

                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setPetsToggled(!petsToggled) }}
                        value={petsToggled}
                    />
                </View>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.FontAwesome5 name='wine-bottle' size={24} color={iconColor} />
                        <Text>Alcohol</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setAlcoholToggled(!alcoholToggled) }}
                        value={alcoholToggled}
                    />
                </View>
                <View style={styles.parameter}>
                    <View style={styles.iconContainer}>
                        <icons.MaterialIcons name='luggage' size={24} color={iconColor} />
                        <Text>Luggage</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { setLuggageToggled(!luggageToggled) }}
                        value={luggageToggled}
                    />
                </View>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='comment' size={24} color={iconColor} />
                        {/* <Text>Luggage</Text> */}
                        <Text>Additional Comments: </Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        editable
                        onChangeText={text => setCommentsValue(text)}
                        value={commentsValue}
                        placeholder="Type here..."
                    />
                </View>
            </View>

            <View style={styles.parameters}>

                <FlatList
                    data={fakeCars}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <CarPreview
                        item={item}
                        selectedCar={selectedCar}
                        setSelectedCar={setSelectedCar}
                        onPress={() => { setSelectedCar(item) }}
                    />}
                    // ItemSeparatorComponent={() => <View style={{ marginRight: 10 }} />}
                    ListFooterComponent={
                        <TouchableOpacity
                            style={styles.addNewCar}
                            onPress={() => { }}
                        >
                            <icons.FontAwesome name='plus' size={28} color={iconColor} />
                        </TouchableOpacity>
                    }
                />
            </View>
            <View style={styles.parameters}>
                <View style={[styles.parameter, { flexDirection: 'column', gap: 10 }]}>
                    <View style={[styles.iconContainer, { alignSelf: 'flex-start' }]}>
                        <icons.MaterialIcons name='comment' size={24} color={iconColor} />
                        <Text>Price per seat</Text>


                    </View>
                    <View style={styles.priceContainer}>

                        <Text style={styles.currency}>EUR</Text>

                        <TextInput
                            style={styles.inputPrice}
                            keyboardType="decimal-pad"
                            placeholder='Enter price per seat'
                            onChangeText={handlePriceChange}
                            value={seatPrice}
                        />
                    </View>

                </View>
            </View>
            <TouchableOpacity >
                <Text >Create a trip</Text>
            </TouchableOpacity>

        </ScrollView>

    )
}

export default t2
const getDynamicStyles = (textColor: string) => {

    return StyleSheet.create({
        btn: {

        },
        container: {
            padding: 10,
            flex: 1
        },
        parameter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // borderWidth: 1,
            // borderRadius: 10,
            padding: 10,
            borderColor: '#a8a8a8'
        },
        iconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
        },
        parameters: {
            gap: 5,
            borderRadius: 10,
            // borderWidth: 1,
            borderColor: '#a8a8a8',
            padding: 5,
            marginBottom: 10
        },
        input: {
            height: 50,
            width: '100%',
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor: '#a8a8a8',
            color: textColor
        },

        currency: {
            position: 'absolute',
            left: 10, // Adjust the position as needed
            // Style your text as needed
        },
        priceContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        inputPrice: {
            height: 50,
            width: '100%',
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor: '#a8a8a8',
            color: textColor,
            paddingLeft: 40
        },
        carsContainer: {

        },
        addNewCar: {
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#a8a8a8',
            height: 100,
            width: 100,
            alignItems: 'center',
            justifyContent: 'center',
        }
    })
}



