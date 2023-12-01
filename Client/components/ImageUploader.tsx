import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as icons from '@expo/vector-icons';
import { updateAccount } from '../utils/apiService';
import { useAuth } from '../utils/auth';


const ImageUploader = ({ onImageSelected }) => {
  const { token } = useAuth()
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const resizedImage = await resizeImage(result.assets[0].uri, 1400);

      // Store the selected image URI in the component's state
      setImage(resizedImage.uri);

      // Pass the selected image URI to the parent component
      onImageSelected(resizedImage.uri);

      // Trigger the update function
      await updateAccount({ image: resizedImage.uri }, token);

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const resizeImage = async (uri, width) => {
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
          <Image source={{ uri: image }} style={styles.picture} />
        ) : (
          <icons.AntDesign
            name="user"
            size={50}
            color="black"
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
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 80,
    marginVertical: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
