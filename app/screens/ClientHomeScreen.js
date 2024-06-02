import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, TextInput, FlatList, ScrollView } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

import { useControl } from '../contexts/ControlProvider'
import { useTheme } from '../contexts/ThemeProvider'
import { darkTheme, standardTheme } from '../assets/themes/mapTheme'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { KeyboardAvoidingView, Platform } from 'react-native'
import BottomSheet from '../components/CustomBottomSheet';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Ionicon from 'react-native-vector-icons/Ionicons'
import MapView, { Marker, Polyline } from 'react-native-maps'
import * as Location from 'expo-location';
import axios from 'axios'
import { db } from '../database/config'
import { set, ref, remove, get, child } from 'firebase/database'


export default function ClientHomeScreen() {

  const { userAsyncData } = useControl()
  const { colors, fonts } = useTheme()
  const styles = createStyles( colors, fonts )
  const [startingLocationDisplay, setStartingLocationDisplay] = useState(); //display message only
  const [destinationLocationDisplay, setDestinationLocationDisplay] = useState(); //diplay message only
  const [startingLocation, setStartingLocation] = useState(); // set starting location
  const [destinationLocation, setDestinationLocation] = useState();  // set destination location
  const [mapRoute, setMapRoute] = useState(null); // suggested route
  const [distance, setDistance] = useState(null); // Display distance
  const [price, setPrice] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // set bottom sheet visibility
  const [searching, setSearching] = useState(false);
  const [searchDisplayLocation, setSearchDisplayLocation] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [submitStatus, setSubmitBtnStatus] = useState("BOOK NOW");
  const [submitDisabled, setSubmitBtnDisabled] = useState(false);
  const mapRef = useRef(null);

  const userLocation = async (setLocation, display) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const newLocation = { latitude: location.coords.latitude, longitude: location.coords.longitude, };
    setLocation(newLocation)
    displayHandler(newLocation, display)
    mapRef.current.animateToRegion({ ...newLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 })
  }

  const geoCodeHandler = async(coordinates, location) => {
    const getLocation = await Location.geocodeAsync(coordinates);
    const newLocation = { latitude: getLocation[0].latitude, longitude: getLocation[0].longitude, };
    location(newLocation)
  }

  const displayHandler = async(coordinates, display) => {
    console.log("coordinates: ", coordinates, " display: ", display);
    const locationName = await Location.reverseGeocodeAsync(coordinates);
    display(`${locationName[0].formattedAddress}`);
  }

  const bookingHandler = async() => {
    console.log("submitStatus: ", submitStatus);
    
      if ( startingLocation && destinationLocation && startingLocationDisplay && destinationLocationDisplay) {
        setSubmitBtnStatus("BOOKING...");
        setSubmitBtnDisabled(true);
        if (submitStatus === "BOOK NOW" || submitStatus === "REBOOK NOW") {
          console.log("submitStatus: BOOKING");
          try {
            await set(ref(db, `client/${userAsyncData.userInformation.username}`), {
              startingLocation: startingLocation,
              destinationLocation: destinationLocation,
              startingLocationDisplay: startingLocationDisplay,
              destinationLocationDisplay: destinationLocationDisplay,
              distance: distance,
              price: price,
              username: userAsyncData.userInformation.username,
            })
            console.log("Booking Successful");
            setTimeout(() => {
              setSubmitBtnStatus("CANCEL BOOKING");
              setSubmitBtnDisabled(false);
            }, 1500);
          } catch (error) {
            console.log(error);
            setSubmitBtnStatus("REBOOK NOW");
            setSubmitBtnDisabled(false);
          }
        } else if (submitStatus === "CANCEL BOOKING") {
          await remove(ref(db, `client/${userAsyncData.userInformation.username}`));
          console.log("Booking Canceled");
          setSubmitBtnStatus("BOOK NOW");
          setSubmitBtnDisabled(false);
        }
      } else {
        console.log("Please select starting and destination locations");
      }
  }

  const searchInputHandler = async () => {
    let searchInput = searchDisplayLocation === 'start' ? startingLocationDisplay : destinationLocationDisplay;
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${searchInput}&format=json&addressdetails=1&countrycodes=PH`);
      setSuggestions(response.data);
    } catch (error) {
      console.log(error);
      setSuggestions([]);
    }
};

  const handleSelect = (item) => {
    const location = item.display_name;
    if (searchDisplayLocation === 'start') {
      setStartingLocationDisplay(location);
    } else {
      setDestinationLocationDisplay(location);
    }
    setSuggestions([]);
    setSearching(false);
    setIsVisible(true);
  };

  useEffect (() => {
    const searchHandler = async () => {
      try {
        if(startingLocationDisplay) {
          await geoCodeHandler(startingLocationDisplay, setStartingLocation);
        }
        if (destinationLocationDisplay) {
          await geoCodeHandler(destinationLocationDisplay, setDestinationLocation);
        }
      } catch (error) {
        null
      }
    }
    searchHandler()
  }, [startingLocationDisplay, destinationLocationDisplay])

  
  useEffect(() => {
    const fecthRoute = async() => {
      setMapRoute(null);
      try {
        if (!startingLocation || !destinationLocation) {
          throw new Error('starting or destination location not set');
        }
        const response = await fetch(`http://router.project-osrm.org/route/v1/motorcar/${startingLocation.longitude},${startingLocation.latitude};${destinationLocation.longitude},${destinationLocation.latitude}?geometries=geojson&overview=full&steps=true`);
        const data = await response.json();
        const coordinates = data.routes[0].geometry.coordinates.map(coord => ({ latitude: coord[1], longitude: coord[0] }));
        setMapRoute(coordinates);
        setDistance(data.routes[0].distance / 1000);
        setPrice(Math.floor((data.routes[0].distance / 1000) * 20));
      } catch (error) {
        setMapRoute(null);
      }
    }

    fecthRoute();
  }, [ startingLocation, destinationLocation ]);

  useEffect(() => {
    const bookChecker = async() => {
      try {
        const snapshot = await get(child(ref(db), `client/${userAsyncData.userInformation.username}`));
        if (snapshot.exists()) {
          setDestinationLocation(snapshot.val().destinationLocation);
          setDestinationLocationDisplay(snapshot.val().destinationLocationDisplay);
          setStartingLocation(snapshot.val().startingLocation);
          setStartingLocationDisplay(snapshot.val().startingLocationDisplay);
          setDistance(snapshot.val().distance);
          setPrice(snapshot.val().price);
          setSubmitBtnStatus("CANCEL BOOKING");
        }
      } catch (error) {
        console.log(error);
      }
    }

    bookChecker();
  }, []);



  return (
    <SafeAreaProvider>    
      <SafeAreaView style={styles.container}>
          <MapView ref={mapRef} 
            style={styles.mapViewContainer} 
            initialRegion={{
              latitude: 14.5995,
              longitude: 120.9842,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }} 
            customMapStyle={standardTheme}>

            { startingLocation &&
              <Marker draggable coordinate={startingLocation} onDragEnd={(e) => { 
                displayHandler({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude }, setStartingLocationDisplay ); 
                setStartingLocation({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude }) 
              }}> 
                <Ionicon name="location-sharp" size={30} color={colors.primary} />
              </Marker>
              }
            { destinationLocation && 
              <Marker draggable coordinate={destinationLocation} onDragEnd={(e) => { 
                displayHandler({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude }, setDestinationLocationDisplay );
                setDestinationLocation({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })
                }}>
                <Ionicon name="location-sharp" size={30} color={colors.primary} />
              </Marker> }
            { mapRoute ? <Polyline coordinates={mapRoute} strokeColor={colors.lightpurple} strokeWidth={6} /> : null }
            
          </MapView>
          <TouchableHighlight style={styles.bottomControl} onPress={() => setIsVisible(!isVisible)}>
              <Text style={styles.bottomControlText}>START MY JOURNEY</Text>
          </TouchableHighlight>
          <BottomSheet isVisible={isVisible} onClose={setIsVisible} height={500} backgroundColor={colors.primary}>
            <View style={styles.bottomSheetFormContainer}>
              <View style={styles.BSinputFormContainer}>
                <View style={styles.BSinputContainer}>
                  <Text style={styles.BSinputLabel}>STARTING LOCATION</Text>
                  <View style={styles.BSTextInputContainer}>
                    <TouchableOpacity onPress={() => {setSearching(!searching); setSearchDisplayLocation('start'); setIsVisible(!isVisible)}}>
                      <Text numberOfLines={1} style={styles.BStextInput}>{startingLocationDisplay}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => userLocation(setStartingLocation, setStartingLocationDisplay)}>
                      <MaterialIcon name="my-location" size={25} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ borderBottomColor: colors.primary, borderBottomWidth: 2, borderRadius: 50}}/>
                <View style={styles.BSinputContainer}>
                  <Text style={styles.BSinputLabel}>DESTINATION</Text>
                  <View style={styles.BSTextInputContainer}>
                    <TouchableOpacity onPress={() => {setSearching(!searching); setSearchDisplayLocation('destination'); setIsVisible(!isVisible)}}>
                      <Text numberOfLines={1} style={styles.BStextInput}>{destinationLocationDisplay}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => userLocation(setDestinationLocation, setDestinationLocationDisplay)}>
                      <MaterialIcon name="my-location" size={25} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.bottomSheetDisplaysContainer}>
                <View style={styles.bottomSheetDisplays}><Text style={styles.bottomSheetDistanceText}>DISTANCE</Text><Text style={styles.bottomSheetDistanceText}>{`${distance ? distance.toFixed(1) : 0} KM`}</Text></View>
                <View style={styles.bottomSheetDisplays}><Text style={styles.bottomSheetDistanceText}>TOTAL FEE</Text><Text style={styles.bottomSheetDistanceText}>{`Php ${price ? price.toFixed(2) : 0.00}`}</Text></View>
              </View>
              <View style={styles.bottomSheetButtonContainer}>
                <TouchableOpacity style={styles.bottomSheetButton} onPress={bookingHandler} disabled={submitDisabled}>
                  <Text style={styles.bottomSheetButtonText}>{submitStatus}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheet>
          <BottomSheet isVisible={searching} onClose={() =>{ setSearching(!searching); setIsVisible(prev => !prev)}} height={"65%"} backgroundColor={colors.background}>
            <View style={styles.searchSheetContainer}>
              <TextInput style={styles.searchInputContainer} placeholder="Search" onChangeText={(text) => {searchDisplayLocation === 'start' ? setStartingLocationDisplay(text) : setDestinationLocationDisplay(text); searchInputHandler()}} value={searchDisplayLocation === 'start' ? startingLocationDisplay : destinationLocationDisplay}></TextInput>
            </View>
            <View style={styles.suggestionContainer}>
              { suggestions.length > 0 && (
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.place_id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.suggestionButton} onPress={() => handleSelect(item)}>
                      <Text style={styles.suggestion}>{item.display_name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </BottomSheet>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const createStyles = ( colors, fonts ) => StyleSheet.create({
  container: {
    flex: 1,
  },
  mapViewContainer: {
    height: '100%',
    width: '100%',
  },
  bottomControl: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    height: 50,
    padding: 10,
  },
  bottomControlText: {
    color: colors.background,
    fontSize: 20,
    fontFamily: fonts.RR,
    textAlign: 'center',
  },
  bottomSheetFormContainer: {
    flex: 1,
    padding: 15,
    width: '100%',
    backgroundColor: colors.primary,
  },
  BSinputFormContainer: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    gap : 20,
  },
  BSinputContainer: {
    flexDirection: 'column',
  },
  BSinputLabel: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: fonts.RR,
    marginBottom: 5,
  },
  BSTextInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  BStextInput: {
    color: colors.primary,
    backgroundColor: colors.form,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 40,
    fontFamily: fonts.RR,
    width: '100%',
    maxWidth: '95%',
    minWidth: '95%',
    fontSize: 15,
    textAlignVertical: 'center',
    overflow: 'hidden', 
    textOverflow: 'ellipsis',
  },
  
  bottomSheetDisplaysContainer: {
    marginTop: 10,
    gap : 10,
    flexDirection: 'column',
  },
  bottomSheetDisplays: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    gap : 10
  },
  bottomSheetDistanceText: {
    fontSize: 15,
    fontFamily: fonts.RR,
    color: colors.primary
  },
  bottomSheetButtonContainer: {
    marginTop: 50,
    flexDirection: 'column',
  },
  bottomSheetButton: {
    backgroundColor: colors.background,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetButtonText: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.RR,
    textAlign: 'center',
  },
  searchSheetContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: colors.form,
    borderRadius: 10,
    height: 40,
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 15,
    fontFamily: fonts.RR,
    color: colors.primary,
  },
  suggestionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    overflow: 'hidden',
  },
  suggestionButton: {
    backgroundColor: colors.form,
    borderRadius: 10,
    padding: 20,
    marginBottom: 5,
  },
  suggestion: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: fonts.RR,
    paddingBottom: 5,
  }
})