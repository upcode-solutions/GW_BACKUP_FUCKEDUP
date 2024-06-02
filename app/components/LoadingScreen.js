import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Loadingscreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#341484" />
      <Text style={styles.loading}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        marginTop: 10, // just for deco
    }
  
})