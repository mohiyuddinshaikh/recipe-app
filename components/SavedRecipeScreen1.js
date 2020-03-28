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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';

import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';

export default function SavedRecipeScreen1({navigation, route}) {
  const dispatch = useDispatch();
  const userDataInStore = useSelector(state => state.saveReducer.recipes);

  console.log('userDataInStore', userDataInStore);

  const handleRemove = item => {
    Alert.alert(
      'Confirmation',
      'Are you sure?',
      [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: () => {
            let data = {
              name: item.name,
            };
            dispatch(Actions.removeRecipe(data));
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.container}>
      {userDataInStore.length < 1 ? (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
          data={userDataInStore}
          renderItem={({item}) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: '#05386b',
                marginTop: 2,
                borderWidth: 2,
                borderRadius: 5,
                marginBottom: 5,
                padding: 9,
              }}>
              <View style={{width: '60%'}}>
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
              <View
                style={{
                  width: '40%',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    let data = {
                      name: item.name,
                      itemId: item.id,
                      imageUrl: item.imageUrl,
                      ingredients: item.ingredients,
                    };
                    dispatch(MiscActions.setIsCallerSavedScreen(true));
                    navigation.navigate('RecipeDetailsScreen', data);
                  }}>
                  <View
                    style={{
                      width: 70,
                      height: 'auto',
                      backgroundColor: '#1aff8c',
                      padding: 7,
                      borderRadius: 5,
                      marginRight: 5,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        textAlign: 'center',
                        fontSize: 15,
                      }}>
                      View
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    handleRemove(item);
                  }}>
                  <View
                    style={{
                      width: 70,
                      height: 'auto',
                      backgroundColor: 'red',
                      padding: 7,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 15,
                      }}>
                      Remove
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* <Text style={styles.text}>hello button</Text> */}
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
    // backgroundColor: '#8ee48f',
    backgroundColor: '#dff9fb',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  item: {
    borderWidth: 2,
    // alignItems: 'flex-start',
    // justifyContent: 'space-between',
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: 'row',
    backgroundColor: '#05386b',
    padding: 9,
  },
  itemText: {
    fontSize: 20,
    marginLeft: 5,
    color: '#edf5e1',
    // paddingTop: 3,
  },
});
