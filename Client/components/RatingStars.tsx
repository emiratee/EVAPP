import React from 'react';
import { Text, View } from 'react-native';
import * as icons from '@expo/vector-icons';
import COLORS from '../COLORS';

type Props = {
    rating: number
}

const renderStars = (rating: number) => {
    const stars: React.JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
        const iconName =
            i <= rating
                ? 'star'
                : i - 0.5 === rating
                    ? 'star-half'
                    : 'star-border';
        stars.push(<Text key={i} testID='star-icon'><icons.MaterialIcons key={i} name={iconName} size={24} color={COLORS.iconColor} /></Text>);
    }
    return stars;
};

const RatingStars = ({ rating }: Props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {renderStars(rating)}
            <Text style={{ marginLeft: 5 }}>{Math.floor(rating)}/5</Text>
        </View>
    );
};

export default RatingStars;