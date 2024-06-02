import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import { useControl } from '../contexts/ControlProvider'
import { db } from '../database/config'
import { ref, set } from 'firebase/database'

export default function OptionScreen() {
  const { userAsyncData, setUserAsyncData } = useControl()
  const user = [["QQhqUsupX0NOL7diSFn9cVTA5O12"],["reLNP3tBGhbHnheSDmG6GMrPLqY2"]]
  const userType = 'client'

  const createDatabase = async () => {
    try {
      set(ref(db, `${userType}/${user[1]}`), {
        latitude: 14.5453, 
        longitude: 121.0658,
        uid: `${user[1]}`,
      })
      console.log('Success');
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={createDatabase}>
        <Text>Create Database</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})