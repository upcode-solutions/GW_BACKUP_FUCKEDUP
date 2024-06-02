// RiderStack.jsimport React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../contexts/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import CustomLogOut from '../components/CustomLogOut';
import ClientHomeScreen from '../screens/ClientHomeScreen';
import OptionScreen from '../screens/OptionScreen';

const Drawer = createDrawerNavigator();

export default function ClientStack () {
    const { colors, fonts } = useTheme();
    const drawerLabelStyle = { fontSize: 15, fontFamily: fonts.RR, marginLeft: 10, color: colors.background };

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
            <Drawer.Screen name="ClientHome" component={ClientHomeScreen} options={{ drawerLabel: 'Home', drawerIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} /> }} />
            <Drawer.Screen name="Option" component={OptionScreen} options={{ drawerLabel: 'Options', drawerIcon: ({ focused, color, size }) => <Ionicons name={focused ? 'cog' : 'cog-outline'} size={size} color={color} /> }} />
        </Drawer.Navigator>
        </SafeAreaProvider>
    );
};

