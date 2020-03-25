import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Button, ImageBackground} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions/SaveAction';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RecipeDetailsScreen1({route}) {
  const dispatch = useDispatch();
  const recipeDataInStore = useSelector(state => state.recipes);
  console.log(route);
  console.log('route', route);
  const itemName = route.params.name;
  const itemCalories = route.params.calories;
  const [isRecipeSaved, setIsRecipeSaved] = useState(false);
  let detailsObj = {
    ingrediants: 10,
    name: 'Pizza',
    description:
      'Pizza is bsjhaj jajksdkjsna jajndknds naDKJDkjajKJ JKNDajNKK good for health.',
    price: '100',
    calories: '100',
  };

  useEffect(() => {
    checkIfRecipeSaved();
  }, []);

  const checkIfRecipeSaved = () => {
    const x = recipeDataInStore.filter(item => {
      if (item.name === itemName) {
        return true;
      }
    });
    if (x.length > 0) {
      setIsRecipeSaved(true);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/pizza.jpeg')}
        style={{width: '100%', height: '100%'}}></ImageBackground>
      <View style={styles.nameTile}>
        <Text style={styles.nameText}>Pizza</Text>
      </View>
      <View style={styles.description}>
        <Text>{detailsObj.description}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.iconPad}>
          <Icon name="tachometer" color="green" size={30} />
          <Text style={{color: 'green'}}>{detailsObj.calories}</Text>
        </View>
        <View style={styles.iconPad}>
          <Icon name="money" size={30} color="red" />
          <Text style={{color: 'red'}}>{detailsObj.price}</Text>
        </View>
        <View style={styles.iconPad}>
          <Icon name="th-list" color="cyan" size={30} />
          <Text style={{color: 'cyan'}}>{detailsObj.ingrediants}</Text>
        </View>
      </View>
      <View style={styles.saveBtn}>
        {/* <Button title="Save Recipe" color="#8326d0" style={{ borderRadius: 50 }}></Button> */}
        {/* redux working fine */}

        {isRecipeSaved ? (
          <Button
            color="red"
            title="Remove this recipe from saved"
            onPress={() => {
              let data = {
                name: itemName,
              };
              dispatch(Actions.removeRecipe(data));
              setIsRecipeSaved(false);
              alert('Recipe removed from saved tab!');
            }}
          />
        ) : (
          <Button
            color="#8326d0"
            title="Save this Recipe"
            onPress={() => {
              let data = {
                name: itemName,
                calories: itemCalories,
              };
              setIsRecipeSaved(true);
              dispatch(Actions.saveRecipe(data));
              alert('Recipe saved in saved tab!');
            }}
          />
        )}
      </View>
    </View>
  );
}
const styles = {
  container: {
    margin: 0,
    padding: 0,
    height: '45%',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    textTransform: 'uppercase',
    color: 'yellow',
  },
  nameTile: {
    marginTop: 5,
    backgroundColor: '#8326d0',
    padding: 9,
    borderRadius: 20,
    minWidth: '40%',
    alignItems: 'center',
  },
  priceAndCal: {
    marginTop: 10,
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    marginTop: 10,
    paddingLeft: 15,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 65,
  },
  iconPad: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 60,
  },
  saveBtn: {
    height: 20,
    marginTop: 10,
    width: '80%',
  },
};
