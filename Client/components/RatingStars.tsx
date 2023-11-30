import React from 'react';
import { Text, View } from 'react-native';
import * as icons from '@expo/vector-icons';

type Props = {}

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const iconName =
      i <= rating
        ? 'star'
        : i - 0.5 === rating
        ? 'star-half'
        : 'star-border';
    stars.push(<icons.MaterialIcons key={i} name={iconName} size={24} color="black" />);
  }
  return stars;
};

const RatingStars = ({ rating }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {renderStars(rating)}
      <Text style={{ marginLeft: 5 }}>{rating}/5</Text>
    </View>
  );
};

export default RatingStars;

// const styles = StyleSheet.create({})