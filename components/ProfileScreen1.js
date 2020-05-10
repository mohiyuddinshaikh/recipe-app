import React, {useState, useEffect, useLayoutEffect, Fragment} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import RedirectToLogin from './RedirectToLogin';
import alertComponent from './functions/Alert';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../assets/constants/Colors';
import {updateUserData} from '../api/user/UserOperations.api';
import toastComponent from './functions/Toast';
import * as UserActions from '../store/actions/UserActions';

export default function ProfileScreen1({navigation, route}) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.miscReducer.isLoggedIn);
  const [showContent, setShowContent] = useState(false);
  console.log('isLoggedIn :>> ', isLoggedIn);
  console.log('navigation :>> ', navigation);

  const userDataInStore = useSelector(state => state.userReducer.user);
  console.log('PROFILE SCREEN KA DATA', userDataInStore);

  useFocusEffect(() => {
    console.log('Test 1');
    someFunction();
  }, []);

  const someFunction = () => {
    console.log('Test 2');
    if (isLoggedIn == true) {
      setShowContent(true);
    } else {
      alertComponent({subheading: 'You are not logged in'});
      navigation.navigate('Home');
    }
  };

  const [changeColor1, setChangeColor1] = useState(false);
  const [changeColor2, setChangeColor2] = useState(false);
  const [newName, setNewName] = useState(null);
  const image = require('../assets/images/chef.jpg');
  const [showLoader, setShowLoader] = useState(false);

  const handleUpdate = async () => {
    if (newName && newName.length !== 0) {
      if (userDataInStore.name === newName) {
        alertComponent({
          subheading: 'Please change information before updating',
        });
      } else {
        let regExpName = /^[a-zA-Z]+$/;
        if (regExpName.test(newName)) {
          setShowLoader(true);
          let data = {name: newName};
          const response = await updateUserData(data);
          console.log('response :>> ', response);
          if (response.status === 200) {
            dispatch(UserActions.updateUser(data));
            toastComponent({message: 'Update Successful'});
            setShowLoader(false);
          } else {
            alertComponent({
              subheading: 'Something went wrong, Please try agian later',
            });
            setShowLoader(false);
          }
        } else {
          alertComponent({
            subheading: 'Invalid format',
          });
        }
      }
    } else {
      alertComponent({subheading: 'Name cannot be blank'});
    }
  };

  return (
    <View style={styles.parentContainer}>
      {showContent
        ? userDataInStore && (
            <View
              style={{
                width: '90%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={image}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 1,
                }}
              />
              <Text style={styles.helloText}>
                Hello {userDataInStore.name} !
              </Text>
              <TextInput
                style={!changeColor1 ? styles.inputBox : styles.inputBoxActive}
                onChangeText={text => {
                  console.log(text);
                  setNewName(text);
                }}
                value={newName.length >= 0 ? newName : userDataInStore.name}
                placeholder={'Name'}
                onFocus={() => setChangeColor1(true)}
                onBlur={() => setChangeColor1(false)}
              />
              <TextInput
                editable={false}
                style={!changeColor2 ? styles.inputBox : styles.inputBoxActive}
                onChangeText={text => {
                  console.log(text);
                  setSearchText(text);
                  autoCompleteSearch(text);
                }}
                value={userDataInStore.email}
                placeholder={'Email'}
                onFocus={() => setChangeColor2(true)}
                onBlur={() => setChangeColor2(false)}
              />

              <View
                style={{
                  width: '100%',
                  marginTop: 15,
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => (showLoader ? null : handleUpdate())}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: colors.themeColor,
                      borderRadius: 10,
                    }}>
                    {showLoader ? (
                      <ActivityIndicator
                        color={colors.white}
                        style={{paddingVertical: 10}}
                      />
                    ) : (
                      <Text style={styles.updateText}>Update</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#dff9fb',
  },
  helloText: {fontSize: 17, textTransform: 'capitalize', marginTop: 10},
  inputBox: {
    width: '100%',
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: 5,
    borderRadius: 5,
  },
  inputBoxActive: {
    width: '100%',
    // borderWidth: 1,
    borderBottomWidth: 2,
    borderBottomColor: colors.themeColor,
    marginTop: 5,
    borderRadius: 5,
  },
  updateText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: colors.white,
  },
});
