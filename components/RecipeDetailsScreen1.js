import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../store/actions/SaveAction';

export default function RecipeDetailsScreen1({route}) {
  const dispatch = useDispatch();
  const recipeDataInStore = useSelector(state => state.recipes);
  console.log(route);
  console.log('route', route);
  const itemName = route.params.name;
  const itemCalories = route.params.calories;
  const [isRecipeSaved, setIsRecipeSaved] = useState(false);

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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Recipe Details Screen!</Text>
      <Text>Recipe Name : {itemName}</Text>
      <Text>Recipe Calories : {itemCalories}</Text>
      {isRecipeSaved ? (
        <Button
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
  );
}
