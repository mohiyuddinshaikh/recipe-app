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
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';
import {signupApi} from '../api/user/Signup.api';
import Login from './Login';
import AsyncStorage from '@react-native-community/async-storage';
import alertComponent from './functions/Alert';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../assets/constants/Colors';

export default function Signup({navigation, route}) {
  console.log('route', route);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [valName, setValName] = useState(null);
  const [valEmail, setValEmail] = useState(null);
  const [valPassword, setValPassword] = useState(null);
  const [showPasswordFormat, setShowPasswordFormat] = useState(false);
  const [signupClickedLoader, setSignupClickedLoader] = useState(false);

  const dispatch = useDispatch();
  // let regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const checkIfFormValid = async () => {
    console.log('Inside form valid function check');
    if (name && email && password) {
      let regExpName = /^[a-zA-Z]+$/;
      let regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let regExpPassword = /[a-zA-Z0-9]/;
      if (name && name.length !== 0) {
        regExpName.test(name) ? setValName(true) : setValName(false);
      } else {
        setValName(false);
      }
      if (email && email.length !== 0) {
        regExpEmail.test(email) ? setValEmail(true) : setValEmail(false);
      } else {
        setValEmail(false);
      }
      console.log('password :>> ', password);
      console.log('password.length :>> ', password.length);

      if (password && password.length !== 0 && password.length > 5) {
        console.log('andar hu');
        setValPassword(true);
      } else {
        setValPassword(false);
      }

      if (valName && valEmail && valPassword) {
        console.log('Test 2');
        if (valName == true && valEmail == true && valPassword == true) {
          return true;
        } else {
          console.log('Test 3');
          console.log('valName :>> ', valName);
          console.log('valEmail :>> ', valEmail);
          console.log('valPassword :>> ', valPassword);
          return false;
        }
      }
    } else {
      console.log('TEst 1');
      return false;
    }
  };

  const handleSignup = async () => {
    setSignupClickedLoader(true);

    let checkIfValid = await checkIfFormValid();
    console.log('checkIfValid :>> ', checkIfValid);

    if (checkIfValid == true) {
      // go on
      const data = {
        name: name,
        email: email,
        password: password,
      };
      const response = await signupApi(data);
      console.log('response', response);
      if (response.status === 200) {
        setSignupClickedLoader(false);

        handleSuccess(response);
        // dispatch(MiscActions.setIsLoggedIn(true));
      }
      if (response.status === 406) {
        setSignupClickedLoader(false);

        console.log('Inside 406');
        return Alert.alert(
          'Alert',
          'Email already exists',
          [
            {
              text: 'Ok',
              onPress: () => {},
            },
            {
              text: 'Go to Login',
              onPress: () => {
                dispatch(MiscActions.showLoginScreen(true));
              },
            },
          ],
          {cancelable: true},
        );
      } else {
        console.log(response.status);
        setSignupClickedLoader(false);
      }
    } else {
      setSignupClickedLoader(false);

      alertComponent({subheading: "One or more inputs formats don't match"});
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

  const [changeColor1, setChangeColor1] = useState(false);
  const [changeColor2, setChangeColor2] = useState(false);
  const [changeColor3, setChangeColor3] = useState(false);

  return (
    <View style={styles.parentContainer}>
      <Image
        source={require('../assets/images/chef.jpg')}
        style={styles.image}
      />
      <View style={styles.textInputContainer}>
        {/* name,email,password */}
        <Text style={styles.inputLabelText}>Name</Text>
        <TextInput
          style={
            valName == null || valName == true
              ? !changeColor1
                ? styles.inputBox
                : styles.inputBoxActive
              : styles.inputBoxError
          }
          onChangeText={text => setName(text)}
          placeholder="Enter Name"
          onFocus={() => {
            setChangeColor1(true);
          }}
          onBlur={() => {
            setChangeColor1(false);
          }}
        />
        <Text style={styles.inputLabelText}>Email</Text>

        <TextInput
          style={
            valEmail == null || valEmail == true
              ? !changeColor2
                ? styles.inputBox
                : styles.inputBoxActive
              : styles.inputBoxError
          }
          onChangeText={text => setEmail(text)}
          placeholder="Enter Email"
          onFocus={() => {
            setChangeColor2(true);
          }}
          onBlur={() => {
            setChangeColor2(false);
          }}
        />
        <Text style={styles.inputLabelText}>Password</Text>

        <TextInput
          style={
            valPassword == null || valPassword == true
              ? !changeColor3
                ? styles.inputBox
                : styles.inputBoxActive
              : styles.inputBoxError
          }
          onChangeText={text => setPassword(text)}
          placeholder="Enter Password"
          onFocus={() => {
            setShowPasswordFormat(true);
            setChangeColor3(true);
          }}
          onBlur={() => {
            setShowPasswordFormat(false);
            setChangeColor3(false);
          }}
        />
        {showPasswordFormat ? (
          <View
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                width: '90%',
              }}>
              <Text style={styles.formatText}> Password Format :</Text>
              <Text style={styles.formatText}> 1) Atleast 6 characters</Text>
              {/* <Text style={styles.formatText}>
                {' '}
                2) Password should be alphanumeric ex: abc123, abcdef
              </Text> */}
            </View>
          </View>
        ) : null}

        <View
          style={{
            width: '100%',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              handleSignup();
            }}>
            <View style={styles.loginTextContainer}>
              {signupClickedLoader ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{color: 'white'}}>SIGN UP</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.notAMemberText}>
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

const styles = StyleSheet.create({
  parentContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#dff9fb',
  },
  inputBox: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputBoxActive: {
    height: 50,
    borderColor: colors.themeColor,
    borderWidth: 2,
    width: '100%',
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputBoxError: {
    height: 50,
    borderColor: 'red',
    borderWidth: 1,
    width: '100%',
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },

  wrapperContainer: {
    width: '100%',
    height: '100%',
    marginTop: 60,
    display: 'flex',
    alignItems: 'center',
  },
  image: {width: '80%', height: '40%'},
  textInputContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '85%',
    marginTop: '1%',
  },
  loginTextContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.themeColor,
    marginTop: '5%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
  notAMemberText: {marginTop: 10, fontSize: 15},
  formatText: {
    fontSize: 16,
    color: '#009900',
    paddingTop: 1,
  },
  inputLabelText: {
    display: 'flex',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
});
