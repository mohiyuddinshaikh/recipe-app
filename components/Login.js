import React, {useState, useEffect} from 'react';
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
import {loginApi} from '../api/user/Signup.api';

export default function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };
    const response = await loginApi(data);
    console.log('response', response);
    if (response.status === 200) {
      // navigation.navigate('Home');
      dispatch(MiscActions.setIsLoggedIn(true));
    }
    if (response.status === 401) {
      handleError(response.status);
    }
    if (response.status === 404) {
      handleError(response.status);
    } else {
      console.log(response.status);
    }
  };

  const handleError = status => {
    if (status === 401) {
      Alert.alert(
        'Alert',
        'Incorrect password',
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
        {cancelable: true},
      );
    }
    if (status === 404) {
      Alert.alert(
        'Alert',
        'Incorrect email',
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
        {cancelable: true},
      );
    }
  };

  const styles = StyleSheet.create({
    inputBox: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      width: '90%',
      marginTop: 10,
    },
  });

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{display: 'flex', alignItems: 'center', width: '100%'}}>
        <Text style={{fontSize: 20, marginBottom: 5}}>Recipe App - Login</Text>
        {/* name,email,password */}

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

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            handleLogin();
          }}>
          <View
            style={{
              padding: 12,
              backgroundColor: '#1a8cff',
              marginTop: 10,
              borderRadius: 10,
            }}>
            <Text style={{color: 'white'}}>LOGIN</Text>
          </View>
        </TouchableOpacity>

        <Text style={{marginTop: 10}}>
          Not a member?<Text> </Text>
          <Text
            onPress={() => {
              dispatch(MiscActions.showLoginScreen(false));
            }}>
            Signup
          </Text>
        </Text>
      </View>
    </View>
  );
}
