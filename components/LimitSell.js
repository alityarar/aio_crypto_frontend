import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LimitSell = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-lg font-bold text-black">LimitSell Page</Text>
    </View>
  );
};

export default LimitSell;
