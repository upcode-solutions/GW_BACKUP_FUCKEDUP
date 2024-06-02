import { StyleSheet, Text, View, Switch , TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

import { useControl } from '../contexts/ControlProvider';
import { useTheme } from '../contexts/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet from '../components/CustomBottomSheet';
import { darkTheme, standardTheme } from '../assets/themes/mapTheme';
import { db } from '../database/config';
import { child, ref, get, set } from 'firebase/database';

export default function RiderHomeScreen() {
  const { userAsyncData, setUserAsyncData } = useControl();
  const { colors, fonts } = useTheme();
  const styles = createStyles(colors, fonts);
  const [viewLocation, setViewLocation] = useState({
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const viewClient = async () => {
      if (isLocationEnabled) {
        try {
          const dbRef = ref(db, 'client');
          const snapshot = await get(dbRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            const clientData = Object.keys(data).map((key) => ({ 
              ...data[key], 
              id: key 
            }));
            setClientLocation(clientData);
          } else {
            console.log('No data available');
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    viewClient();
  }, [isLocationEnabled]);

  const ClientMarkers = () => {
    if (clientLocation) {
      return clientLocation.map((client) => (
        <Marker key={client.id} coordinate={client.startingLocation} pinColor={colors.primary} onPress={() => {setIsVisible(true); setClientData(client)}} >
          <Ionicons name="location-sharp" size={40} color={colors.primary} />
        </Marker>
      ));
    }
    return null;
  };
  
  const enableBookingHandler = async () => {
    try {
      setIsLocationEnabled(!isLocationEnabled);
      const newIsLocationEnabled = !isLocationEnabled;
      if (newIsLocationEnabled) {
        let location = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRiderLocation(newLocation);
        setViewLocation(newLocation);
        mapRef.current.animateToRegion(newLocation, 1000);
      } else {
        setRiderLocation(null);
        setClientLocation(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptBooking = async () => {
    console.log(clientData.username);
    try {
      await set(ref(db, `client/${clientData.username}`), {
        ...clientData,
        status: 'accepted',
      });
      console.log('Booking Accepted');
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <MapView ref={mapRef} style={styles.mapContainer} initialRegion={viewLocation} minZoomLevel={10} maxZoomLevel={20} customMapStyle={standardTheme} >
          {riderLocation &&
          <Marker coordinate={riderLocation}>
            <Ionicons name="radio-button-on-outline" size={30} color={colors.primary}/>
          </Marker>
          }
          { ClientMarkers() }
        </MapView>
        <View style={styles.overlayContainer}>
          <Text style={styles.overlayText}>Accept Bookings</Text>
          <Switch trackColor={{ false: 'grey', true: '#c595fa' }} thumbColor={isLocationEnabled ? colors.backgroundColor : 'lightgrey'} onValueChange={() => enableBookingHandler()} value={isLocationEnabled} />
        </View>
        <BottomSheet isVisible={isVisible} onClose={() => setIsVisible(!isVisible)} height={300} backgroundColor="white">
          <View>
            <Text>Client Data</Text>
            <Text>Client Name: {clientData &&
             clientData.username}</Text>
             <TouchableOpacity onPress={acceptBooking}>
              <Text>Accept</Text>
             </TouchableOpacity>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const createStyles = (colors, fonts) => StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    height: 70,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
