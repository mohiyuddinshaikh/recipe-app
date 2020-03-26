import React, {useState} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export default function SavedRecipeScreen1({route}) {
  const userDataInStore = useSelector(state => state.recipes);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Helllooooo</Text>
      {userDataInStore.map((item, index) => {
        return (
          <View>
            <Text>Recipe Number {index}</Text>
            <Text>Recipe Type : {item.name}</Text>
            <Text>Calories : {item.calories}</Text>
          </View>
        );
      })}
    </View>
  );
}
