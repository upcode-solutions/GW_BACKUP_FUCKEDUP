import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../contexts/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

import CustomHeader from '../components/CustomHeader';
import CustomLogOut from '../components/CustomLogOut';
import RiderHomeScreen from '../screens/RiderHomeScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import CollectionScreen from '../screens/CollectionScreen';
import OptionScreen from '../screens/OptionScreen';

const Drawer = createDrawerNavigator();

export default function RiderStack() {
  const { colors, fonts } = useTheme();
  const drawerLabelStyle = { fontSize: 15, fontFamily: fonts.RR, marginLeft: 10, color: colors.background };
  let iconSize = 25

  return (
    <SafeAreaProvider>
      <Drawer.Navigator
        screenOptions={{
          header: (props) => <CustomHeader {...props} />,
          drawerStyle: {
            backgroundColor: colors.primary,
            width: '80%',
            paddingTop: '15%'
          },
          drawerActiveBackgroundColor: colors.background,
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.background,
          drawerLabelStyle: { 
            fontSize: 15,
            fontFamily: fonts.RR,
            marginLeft: 10,
          },
        }}
        drawerContent={(props) => <CustomLogOut {...props} drawerLabelStyle={drawerLabelStyle} />}
      >
        <Drawer.Screen name="Home" component={RiderHomeScreen} options={{ drawerLabel: 'Home',drawerIcon: ({ focused, color }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={iconSize} color={color} />}} />
        <Drawer.Screen name="Transaction" component={TransactionHistoryScreen} options={{ drawerLabel: 'History', drawerIcon: ({ focused, color }) => <Ionicons name={focused ? 'book' : 'book-outline'} size={iconSize} color={color} /> }} />
        <Drawer.Screen name="Collection" component={CollectionScreen} options={{ drawerLabel: 'Collection', drawerIcon: ({ focused, color }) => <Ionicons name={focused ? 'newspaper' : 'newspaper-outline'} size={iconSize} color={color} /> }} />
        <Drawer.Screen name="Option" component={OptionScreen} options={{ drawerLabel: 'Options', drawerIcon: ({ focused, color }) => <Ionicons name={focused ? 'cog' : 'cog-outline'} size={iconSize} color={color} /> }} />
      </Drawer.Navigator>
    </SafeAreaProvider>
  );
}
