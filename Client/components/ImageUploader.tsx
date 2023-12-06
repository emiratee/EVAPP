import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as icons from '@expo/vector-icons';
import { updateAccount, cloudinaryUpload } from '../utils/apiService';
import { useAuth } from '../utils/auth';

import * as types from '../types/types'
import COLORS from '../COLORS';

const ImageUploader = ({ }) => {
    const { token, user } = useAuth()
    const [image, setImage] = useState<string>(user && user.imageUrl || "");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setImage(user && user.imageUrl || "")
    }, [user, token])
    
    const pickImage = async () => {
        setIsLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const resizedImage = await resizeImage(result.assets[0].uri, 1400); // resize image

            const uriParts = result.assets[0].uri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            const formData: types.TImageFormData = new FormData();
            formData.append('file', {
                uri: resizedImage.uri,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            });
            formData.append('upload_preset', 'profile_image')

            const imageUrl = await cloudinaryUpload(formData)

            setImage(imageUrl);
            token && await updateAccount({ image: imageUrl }, token);

            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };



    const resizeImage = async (uri: string, width: number) => {
        const resizedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width } }],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        return resizedImage;
    };

    return (
        <TouchableOpacity style={styles.picture} onPress={pickImage}>
            <View style={styles.picture}>
                {isLoading ? (
                    <ActivityIndicator size={'large'} />
                ) : image ? (
                    <Image source={{ uri: image }}
                        style={styles.picture} />
                ) : (
                    <icons.AntDesign
                        name="user"
                        size={50}
                        color={COLORS.iconColor}
                        style={{ alignSelf: 'center' }}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default ImageUploader;

const styles = StyleSheet.create({
    picture: {
        height: 120,
        width: 120,
        borderWidth: 2,
        borderColor: COLORS.iconColor,
        borderRadius: 80,
        marginVertical: 10,
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
});
