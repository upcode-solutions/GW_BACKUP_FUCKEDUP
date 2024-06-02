import React, { createContext, useContext } from 'react';
import { useFonts } from 'expo-font';
import { View, Text } from 'react-native';

const themeContext = createContext();

const ThemeProvider = ({ children }) => {

    const [fontsLoaded] = useFonts({ // load fonts
        "Designer": require("../assets/fonts/Designer.otf"),
        "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
        "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
        "RR": require("../assets/fonts/Righteous-Regular.ttf")
      });

      if (!fontsLoaded) {
        return(
        <View>
            <Text>Loading...</Text>
        </View>
        );
    }
    
    const FontsAndColors = {
        colors: {
            primary: '#371287',
            secondary: '#6637CE',
            lightpurple: '#AA81D5',
            darkpurple: '#301848',
            purpleBackground: '#C3B1E1',
            background: '#FCF9F7',
            form: '#f2eded',
            error: 'orange',
        },
        fonts: {
            Designer: "Designer",
            Rubik: "Rubik-Regular",
            RubikSemiBold: "Rubik-SemiBold",
            RR: "RR"
        }
    }

    return (
        <themeContext.Provider value={FontsAndColors}>
            {children}
        </themeContext.Provider>
    );
};

export const useTheme = () => useContext(themeContext);
export default ThemeProvider