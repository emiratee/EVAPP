import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CheckBox, Icon } from '@rneui/themed';
import { useAuth } from '../utils/auth';
import * as icons from '@expo/vector-icons';
import { useChat } from '../utils/chat';


const Message = ({ item }) => {    
    const { user } = useAuth();    
    const { setName, setImageUrl } = useChat();
    const [checkMessage, setCheckMessage] = useState(false);
    const name = item.driver.userId === user.userId ? item.passenger.name : item.driver.name;
    const imageUrl = item.driver.userId === user.userId ? item.passenger.imageUrl : item.driver.imageUrl;
    const lastMessage = item.chat.length > 0 && item.chat[item.chat.length - 1].message.content;
    
    useEffect(() => {
        setName(name);
        setImageUrl(imageUrl);
    })
    return (
        <View style={[styles.message, { justifyContent: 'space-between' }]}>
            <View style={styles.message}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <icons.AntDesign name="user" size={40} color="black" />
                )}
                {lastMessage ? (
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>{name}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '300', fontStyle: 'italic' }}>{lastMessage.length >= 35 ? lastMessage.substring(0,32) + '...' : lastMessage}</Text>
                    </View>
                ) : (
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>{name}</Text>
                    </View>
                )}
            </View>

            <View>
                <CheckBox
                    center
                    checkedIcon={
                        <Icon
                            name='radio-button-checked'
                            type='material'
                            color='#8757f7'
                            size={28}
                        />
                    }
                    uncheckedIcon={
                        <Icon
                            name='radio-button-unchecked'
                            type='material'
                            color='grey'
                            size={28}
                        // iconStyle={{}}
                        />
                    }
                    checked={checkMessage}
                    onPress={() => setCheckMessage(!checkMessage)}
                />
            </View>

        </View>
    )
}

export default Message;

const styles = StyleSheet.create({
    message: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 15,
    },
    image: {
        height: 50,
        width: 50,
        padding: 8,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: '#000',
    },

});

// HARCODING EXAMPLES
/* <TouchableOpacity style={styles.container}>
                        <View style={styles.message}>
                            <View style={styles.image}>
                                <Text style={{height: 20, width: 20, textAlign: 'center'}}>B</Text>
                            </View>
                            <View>
                                <Text>Britney Spears</Text> 
                                <Text>It's Britney b*tch💕 </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.container}>
                        <View style={styles.message}>
                            <View style={styles.image}>
                                <Text style={{height: 20, width: 20, textAlign: 'center'}}>C</Text>
                            </View>
                            <View>
                                <Text>Chuck Norris</Text> 
                                <Text>Hi Magdalena, do you need help with...</Text>
                            </View>
                        </View>
                    </TouchableOpacity> */