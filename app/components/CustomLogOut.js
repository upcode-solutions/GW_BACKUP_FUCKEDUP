import React from 'react';
import { View } from 'react-native';
import { DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useControl } from '../contexts/ControlProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeProvider';

export default function CustomLogOut(props) {
  const { drawerLabelStyle } = props;
  const { colors } = useTheme();
  const { userAsyncData, setUserAsyncData } = useControl();
  
  const logout = async() => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify({...userAsyncData, isLoggedIn: false ,userInformation: {}}))
      await setUserAsyncData({...userAsyncData, isLoggedIn: false ,userInformation: {}})
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Log Out"
        labelStyle={drawerLabelStyle}
        icon={({ focused, color, size }) => (
          <Ionicons name={focused ? 'log-out' : 'log-out-outline'} size={size} color={colors.background} />
        )}
        onPress={logout}
      />
    </View>
  );
}
