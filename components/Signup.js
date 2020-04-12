import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';
import {signupApi} from '../api/user/Signup.api';
import Login from './Login';
import AsyncStorage from '@react-native-community/async-storage';

export default function Signup({navigation, route}) {
  console.log('route', route);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    const data = {
      name: name,
      email: email,
      password: password,
    };
    const response = await signupApi(data);
    console.log('response', response);
    if (response.status === 200) {
      handleSuccess(response);
      // const shuruKar = async () => {
      //   await AsyncStorage.setItem('jwtSecret', response.token);
      // };

      // dispatch(MiscActions.setIsLoggedIn(true));
    } else {
      console.log(response.status);
    }
  };

  const handleSuccess = async response => {
    try {
      console.log('response', response);
      console.log('signup token', response.data.accessToken);
      await AsyncStorage.setItem('jwtSecret', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      dispatch(MiscActions.setIsLoggedIn(true));
    } catch (error) {
      console.log('error', error);
    }
  };

  const styles = StyleSheet.create({
    inputBox: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      width: '85%',
      marginTop: 10,
      borderRadius: 5,
    },
  });

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('akey');
      console.log('value', value);
      if (value !== null) {
        // value previously stored
        console.log('value under func', value);
        alert('value is ', value);
      }
    } catch (e) {
      // error reading value
      console.log('e', e);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dff9fb',
      }}>
      <Image
        source={require('../assets/images/chef.jpg')}
        style={{width: '80%', height: '40%'}}
      />
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          marginTop: '5%',
        }}>
        {/* <Text style={{fontSize: 20, marginBottom: 5}}>Recipe App - Signup</Text> */}
        {/* name,email,password */}
        <TextInput
          style={styles.inputBox}
          onChangeText={text => setName(text)}
          placeholder="Enter Name"
        />
        <TextInput
          style={styles.inputBox}
          onChangeText={text => setEmail(text)}
          placeholder="Enter Email"
        />
        <TextInput
          style={styles.inputBox}
          onChangeText={text => setPassword(text)}
          placeholder="Enter Password"
        />
        {/* <Button title="Display in storage" onPress={() => getData()} /> */}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            handleSignup();
          }}>
          <View
            style={{
              paddingVertical: 14,
              paddingHorizontal: 25,
              backgroundColor: '#1a8cff',
              marginTop: '5%',
              borderRadius: 10,
            }}>
            <Text style={{color: 'white'}}>SIGN UP</Text>
          </View>
        </TouchableOpacity>

        <Text style={{marginTop: 10, fontSize: 15}}>
          Already a member?<Text> </Text>
          <Text
            onPress={() => {
              dispatch(MiscActions.showLoginScreen(true));
            }}
            style={{textDecorationLine: 'underline'}}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}
