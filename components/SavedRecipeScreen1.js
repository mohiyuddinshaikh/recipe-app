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
} from 'react-native';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';
import * as UserActions from '../store/actions/UserActions';

import AsyncStorage from '@react-native-community/async-storage';

import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';
import {removeRecipe} from '../api/user/UserOperations.api';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../assets/constants/Colors';

export default function SavedRecipeScreen1({navigation, route}) {
  const dispatch = useDispatch();
  // const isFocused = useIsFocused();

  const userDataInStore = useSelector(state => state.userReducer.user);

  console.log('userDataInStore', userDataInStore);

  // useFocusEffect(() => {
  //   dispatch(MiscActions.setSavedScreenActive(false));

  //   console.log('Running now');
  // }, []);

  const handleRemove = item => {
    console.log('item', item);
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to remove "${
        item.recipeName
      }" from saved recipes?`,
      [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: async () => {
            const removeData = {
              userId: userDataInStore._id,
              recipeId: item.recipeId,
            };
            dispatch(UserActions.removeRecipe(removeData));
            const response = await removeRecipe(removeData);
            console.log('response from remove recipe', response);
          },
        },
      ],
      {cancelable: true},
    );
  };

  // const storeData = async () => {
  //   try {
  //     await AsyncStorage.setItem('somekey', 'banana');
  //     alert('Stored');
  //   } catch (e) {
  //     // saving error
  //     console.log('e', e);
  //   }
  // };

  const getData = async () => {
    try {
      const value2 = await AsyncStorage.getItem('jwtSecret');
      if (value2 !== null) {
        console.log('value2', value2);
      }

      console.log('value', value);
      if (value !== null) {
        // value previously stored
        console.log('value2 is', value2);
      }
    } catch (e) {
      // error reading value
      console.log('e', e);
    }
  };

  return (
    <View style={styles.container}>
      {userDataInStore && userDataInStore.recipes.length < 1 ? (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Button title="Save in storage" onPress={() => storeData()} />
          <Button title="Display in storage" onPress={() => getData()} /> */}
          <Image
            source={require('../assets/images/empty.jpg')}
            style={{width: '55%', height: '55%'}}
          />
          <Text style={{fontSize: 16, marginTop: 10}}>
            Oops! No Saved Recipes Yet !
          </Text>
        </View>
      ) : (
        <FlatList
          data={userDataInStore && userDataInStore.recipes}
          extraData={userDataInStore}
          renderItem={({item}) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 2,
                borderWidth: 1,
                borderColor: colors.themeColor,
                borderRadius: 5,
                marginBottom: 5,
                padding: 9,
              }}>
              <View style={{width: '82%'}}>
                <Text style={styles.itemText}>{item.recipeName}</Text>
              </View>
              <View
                style={{
                  width: '18%',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    let data = {
                      name: item.recipeName,
                      itemId: item.recipeId,
                      imageUrl: item.imageUrl,
                      ingredients: item.recipeIngredients,
                    };
                    // dispatch(MiscActions.setSavedScreenActive(true));
                    navigation.navigate('RecipeDetailsScreen', data);
                  }}>
                  <MaterialCommunityIcons
                    name={'eye'}
                    size={25}
                    color={colors.themeColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    handleRemove(item);
                  }}>
                  <MaterialCommunityIcons
                    name={'delete'}
                    size={27}
                    color="#ff6666"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    margin: 0,
    padding: 10,

    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },

  itemText: {
    fontSize: 20,
    marginLeft: 5,
    color: 'black',
  },
});
