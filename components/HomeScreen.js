import React, {useState} from 'react';
import {View, Text, FlatList, Button, TouchableOpacity} from 'react-native';
import * as Actions from '../store/actions/SaveAction';

import {useDispatch, useSelector} from 'react-redux';

let HomeScreen1 = ({navigation}) => {
  const recipeDataInStore = useSelector(state => state.recipes);
  console.log('recipeDataInStore', recipeDataInStore);

  const [recipes, setRecipes] = useState([
    {key: '1200', name: 'Pizza', calories: 10},
    {key: '1201', name: 'Biryani', calories: 20},
    {key: '1202', name: 'Marshmellow', calories: 30},
    {key: '1203', name: 'Burger', calories: 40},
    {key: '1204', name: 'Pasta', calories: 35},
  ]);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              let data = {
                name: item.name,
                calories: item.calories,
              };
              navigation.navigate('RecipeDetailsScreen', data);
            }}>
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={styles.itemButton}>
                <Button
                  title="Details"
                  onPress={() => {
                    let data = {
                      name: item.name,
                      calories: item.calories,
                    };
                    navigation.navigate('RecipeDetailsScreen', data);
                  }}
                />

                {recipeDataInStore.map(recipeItem =>
                  recipeItem.name === item.name ? (
                    <View>
                      <Text style={{color: 'white'}}>Saved</Text>
                    </View>
                  ) : null,
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = {
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
};
export default HomeScreen1;
