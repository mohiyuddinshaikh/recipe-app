import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  View,
  Text,
  FlatList,
  Button,
  ImageBackground,
  Platform,
  Image,
  ScrollView,
  ToastAndroid,
  Alert,
  StyleSheet,
} from 'react-native';

export default function ProfileScreen1() {
  const userDataInStore = useSelector(state => state.userReducer.user);
  console.log('PROFILE SCREEN KA DATA', userDataInStore);
  return (
    <View style={styles.parentContainer}>
      {userDataInStore && (
        <Text style={styles.helloText}>Hello {userDataInStore.name} !</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dff9fb',
  },
  helloText: {fontSize: 20, textTransform: 'capitalize'},
});
