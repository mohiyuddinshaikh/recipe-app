import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as MiscActions from '../store/actions/MiscActions';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../assets/constants/Colors';

export default function Logout({navigation}) {
  const dispatch = useDispatch();
  useEffect(() => {
    AsyncStorage.removeItem('jwtSecret');
    dispatch(MiscActions.setIsLoggedIn(false));
    dispatch(MiscActions.showLoginScreen(true));
    navigation.navigate('Home');
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
      }}>
      <ActivityIndicator size="small" color="#0000ff" />
    </View>
  );
}
