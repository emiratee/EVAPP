import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useMockData } from '../../mockData';

type Props = {}

const addCredits = (props: Props) => {

    const { mockUsers } = useMockData();

  return (
    <View style={styles.container}>
        <View style={styles.creditsBalance}>
            <Text style={styles.title}>Credit Balance: </Text>
            <Text style={styles.creditsValue}>{mockUsers[0].credits}€</Text>
        </View>
        <Text style={styles.subtitle}>Purchase additional credits using the various payment methods</Text>
    </View>
  )
}

export default addCredits

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%',
        padding: 10,
    },
    creditsBalance: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    creditsValue: {
        fontSize: 22,
        fontWeight: '300',
        paddingLeft: 5,
    },
    subtitle : {
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 30,
        textAlign: 'center',
    }
})
