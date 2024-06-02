import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

export default function BottomSheet ({ isVisible, onClose, height, backgroundColor, children }){
  const toggleBottomSheet = () => {
    onClose(!isVisible);
  };

  return (
    <SafeAreaView>
      <Modal
        isVisible={isVisible}
        onBackButtonPress={toggleBottomSheet}
        onBackdropPress={toggleBottomSheet}
        swipeDirection="down"
        onSwipeComplete={toggleBottomSheet}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={{ backgroundColor: backgroundColor, height: height, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={toggleBottomSheet} style={styles.header}>
              <Ionicons name="chevron-down" size={24} color="grey" />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: '100%',
  },
  header: {
    alignContent: 'center',
    justifyContent: 'center',
  }
});