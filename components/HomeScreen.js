import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as Actions from '../store/actions/SaveAction';
import axios from 'axios';
import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';

import { useDispatch, useSelector } from 'react-redux';

let HomeScreen1 = ({ navigation }) => {
  const recipeDataInStore = useSelector(state => state.recipes);
  const [importedRecipes, setImportedRecipes] = useState();
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();
  console.log('recipeDataInStore', recipeDataInStore);
  useEffect(() => {
    console.log('I ran');
    getRecipeFromApi();
  }, []);

  const getRecipeFromApi = async () => {
    const foodItem = 'biryani';
    const numberOfResults = '10';
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/search?apiKey=${spoonacularApiKey}&query=${foodItem}&number=${numberOfResults}&instructionsRequired=true`,
    );
    console.log(response);
    setImportedRecipes(response.data.results);
    setBaseUrlSpoonacular(response.data.baseUri);
  };

  const dispatch = useDispatch();

  return (
    <View style={styles.parentBackground}>
      <FlatList
        data={importedRecipes}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.solocontainer}>
              <TouchableOpacity
                onPress={() => {
                  let data = {
                    name: item.title,
                    calories: '30',
                    itemId: item.id,
                    imageUrl: `${baseUrlSpoonacular + item.image}`,
                  };
                  navigation.navigate('RecipeDetailsScreen', data);
                }}>
                <View style={styles.container}>
                  {/* <View style={styles.imagecontainer}> */}
                  <Image
                    source={{ uri: `${baseUrlSpoonacular + item.image}` }}
                    style={styles.image}
                  />
                  {/* </View>   */}
                  <Text style={{ textAlign: 'center' }}> {item.title}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      // ListFooterComponent={this.renderFooter}
      />
    </View>
    // <View style={styles.container}>
    //   <FlatList
    //     data={recipes}
    //     renderItem={({item}) => (
    //       <TouchableOpacity
    //         onPress={() => {
    //           let data = {
    //             name: item.name,
    //             calories: item.calories,
    //           };
    //           navigation.navigate('RecipeDetailsScreen', data);
    //         }}>
    //         <View style={styles.item}>
    //           <Text style={styles.itemText}>{item.name}</Text>
    //           <View style={styles.itemButton}>
    //             <Button
    //               title="Details"
    //               onPress={() => {
    //                 let data = {
    //                   name: item.name,
    //                   calories: item.calories,
    //                   description: item.description,
    //                   price: item.price,
    //                   ingrediants: item.ingrediants,
    //                 };
    //                 navigation.navigate('RecipeDetailsScreen', data);
    //               }}
    //             />

    //             {recipeDataInStore.map(recipeItem =>
    //               recipeItem.name === item.name ? (
    //                 <View>
    //                   <Text style={{color: 'white'}}>Saved</Text>
    //                 </View>
    //               ) : null,
    //             )}
    //           </View>
    //         </View>
    //       </TouchableOpacity>
    //     )}
    //   />
    // </View>
  );
};

const styles = {
  solocontainer: {
    height: 'auto',
    width: 178,
    marginTop: 5,
    marginLeft: 3,
    marginEnd: 1
  },

  container: {
    height: 'auto',
    flex: 1,
  },
  textstyle: {
    color: 'red',
  },
  image: {
    height: 200,
    width: 170,
    borderRadius: 10
  },
  imagecontainer: {
    marginTop: 10,
  },
  parentBackground: {
    backgroundColor: '#ffeaa7',
  },
};
export default HomeScreen1;
