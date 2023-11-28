import { StyleSheet, } from 'react-native'
import { Text, View } from './Themed'
import React, { useEffect, useState } from 'react'
import * as icons from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

type Props = {
    item: any,
    setSelectedCar: any,
    selectedCar: any,
    onPress: () => void
}

const CarPreview = (props: Props) => {
    const [isSelected, setIsSelected] = useState<boolean>(props.selectedCar?.id === props.item.id)
    const styles = getDynamicStyles();
    useEffect(() => {
        props.selectedCar?.id === props.item.id ? setIsSelected(true) : setIsSelected(false);
    }, [props.selectedCar])

    return (
        <TouchableOpacity
            style={[styles.wrapper, isSelected && styles.selected]}
            onPress={props.onPress}
        >
            <Text style={{ fontWeight: "bold" }}>{props.item.model}</Text>

            <Text>{props.item.color}</Text>
            <View style={{ flexDirection: 'row' }}>
                <Text>{props.item.seats}</Text>
                <icons.MaterialCommunityIcons name='seat-passenger' size={18} />
            </View>
            <Text>{props.item.licencePlate}</Text>



        </TouchableOpacity>
    )
}

export default CarPreview

const getDynamicStyles = () => {

    return StyleSheet.create({
        wrapper: {
            // backgroundColor: '#eee',
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#a8a8a8',
            height: 100,
            width: 100,
            marginRight: 10,
            justifyContent:'space-between'

        },
        selected: {
            borderWidth: 1,
            borderColor: '#e30000',
        }

    })
}

