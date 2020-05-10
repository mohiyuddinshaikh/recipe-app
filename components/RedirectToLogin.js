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

export default function RedirectToLogin() {
  return (
    <View style={styles.parentContainer}>
      <Text>
        Hey, Seems like you have logged out of the app. Please Login to continue
      </Text>
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
