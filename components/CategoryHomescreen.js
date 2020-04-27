import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import * as Actions from '../store/actions/SaveAction';
import * as MiscActions from '../store/actions/MiscActions';
import * as UserActions from '../store/actions/UserActions';
import Category1 from './categories/Category1';
import Category2 from './categories/Category2';
import Category3 from './categories/Category3';

// Categories description
// Category 1 : ItemSpecificCategory : Chicken,Paneer
// Category 2 : MealSpecificCategory : Breakfast, Lunch, Snack, Soup, Dessert,
// Category 3 : FoodSpecificCategory : Biryani, Pizza

export default function CategoryHomescreen({route, navigation}) {
  console.log('route.params :>> ', route.params);
  const data = route.params;
  console.log('data of category home screen :>> ', data);

  return route != null && route != undefined && route.params.category == 1 ? (
    <Category1 data={data} navigation={navigation} />
  ) : route.params.category == 2 ? (
    <Category2 />
  ) : (
    <Category3 data={data} navigation={navigation} />
  );
}
