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
      // navigation.navigate('Home');
      dispatch(MiscActions.setIsLoggedIn(true));
    } else {
      console.log(response.status);
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
        <Text style={{fontSize: 20, marginBottom: 5}}>Recipe App - Signup</Text>
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

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            handleSignup();
          }}>
          <View
            style={{
              padding: 12,
              backgroundColor: '#1a8cff',
              marginTop: 10,
              borderRadius: 10,
            }}>
            <Text style={{color: 'white'}}>SIGN UP</Text>
          </View>
        </TouchableOpacity>

        <Text style={{marginTop: 10}}>
          Already a member?<Text> </Text>
          <Text
            onPress={() => {
              dispatch(MiscActions.showLoginScreen(true));
            }}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}
