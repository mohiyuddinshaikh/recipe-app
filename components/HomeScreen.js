import React, { useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as Actions from '../store/actions/SaveAction';

import { useDispatch, useSelector } from 'react-redux';

let HomeScreen1 = ({ navigation }) => {
  const recipeDataInStore = useSelector(state => state.recipes);
  console.log('recipeDataInStore', recipeDataInStore);

  const [recipes, setRecipes] = useState([
    { key: '1200', name: 'Pizza', calories: 10, description: 'Pizza is good for health.', price: '100', ingrediants: "10" },
    { key: '1201', name: 'Biryani', calories: 20, description: 'Biryani is good for health.', price: '100', ingrediants: "15" },
    { key: '1202', name: 'Marshmellow', calories: 30, description: 'Marshmellow is good for health.', price: '100', ingrediants: "14" },
    { key: '1203', name: 'Burger', calories: 40, description: 'Burger is good for health.', price: '100', ingrediants: "13" },
    { key: '1204', name: 'Pasta', calories: 35, description: 'Pasta is good for health.', price: '100', ingrediants: "12" },
  ]);
  const dispatch = useDispatch();

  return (
    <View style={{width: "100%", height: "100%", backgroundColor: "cyan", flexDirection: "row", margin: 3, flexWrap: "wrap"}}>
      <View style={styles.tile}>
        <Image source={require("../assets/pizza.jpeg")} style={{width: "100%", height: "85%"}} ></Image>
        <Text style={{color: "white"}}>Pasta</Text>
      </View>
      <View style={styles.tile}>
        <Image source={require("../assets/pizza.jpeg")} style={{width: "100%", height: "85%"}} ></Image>
      </View>
      <View style={styles.tile}>
        <Image source={require("../assets/pizza.jpeg")} style={{width: "100%", height: "85%"}} ></Image>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: "48%",
    height: "50%",
    backgroundColor: "black",
    margin: 2,
    borderWidth: 2,
    borderRadius: 5
  }
});
export default HomeScreen1;
