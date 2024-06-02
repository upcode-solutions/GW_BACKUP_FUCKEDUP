// CustomHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native'; // Assuming you are using React Native

import { useTheme } from '../contexts/ThemeProvider';
import { useControl } from '../contexts/ControlProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CustomHeader({navigation}) {

    const { colors, fonts } = useTheme();
    const { userAsyncData } = useControl();
    const iconSize = 33;
    const fontSize = 25;
    const styles = createStyles(colors, fonts, fontSize);

    return (
        <SafeAreaView>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={iconSize} color={'white'}/>
                </TouchableOpacity>
                <View style={styles.BrandingContainer}>
                    <Text style={styles.Branding1}>GO</Text>
                    <Text style={styles.Branding2}>WITH</Text>
                </View>
                <TouchableOpacity style={styles.ProfilePic}>
                    <Image source={{ uri: userAsyncData.userInformation.profilePhoto }} style={{width: iconSize, height: iconSize, borderRadius: 50}}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (colors, fonts, fontSize) => ({
    header: {
        height: 57,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: colors.primary,
    },
    BrandingContainer: {
        flexDirection: 'row',
    },
    Branding1: {
        fontSize: fontSize,
        fontFamily: fonts.RR,
        color: 'white',
    },
    Branding2: {
        fontSize: fontSize,
        fontFamily: fonts.RR,
        color: 'white',
    },
    ProfilePic: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.secondary,
        borderRadius: 50,
    }
})