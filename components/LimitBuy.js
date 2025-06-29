import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LimitBuy = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-lg font-bold text-black">LimitBuy Page</Text>
    </View>
  );
};

export default LimitBuy;
