import React, { useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions/SaveAction';

export default function SavedRecipeScreen1({ route }) {
  const dispatch = useDispatch();
  const userDataInStore = useSelector(state => state.recipes);

  return (
    <View style={styles.container}>
      <FlatList
        data={userDataInStore}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={styles.itemButton}>
                <Button
                  title="Remove"
                  color="red"
                  onPress={() => {
                    Alert.alert("Confirmation","Are you sure?", [{
                      text: "No", onPress: () => { }
                    }, {
                      text: "Yes", onPress: () => {
                        let data = {
                          name: item.name,
                        };
                        dispatch(Actions.removeRecipe(data));
                      }
                    }], {cancelable: true})
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 10,
    backgroundColor: '#8ee48f',
    height: '100%',
  },
  item: {
    borderWidth: 2,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: 'row',
    backgroundColor: '#05386b',
    padding: 5,
  },
  itemText: {
    fontSize: 20,
    marginLeft: 5,
    color: '#edf5e1',
    paddingTop: 3,
  },
});