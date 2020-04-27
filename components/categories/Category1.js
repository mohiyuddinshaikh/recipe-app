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
import axios from 'axios';
import SearchFixed from '../search/SearchFixed';
import spoonacularApiKey from '../../assets/constants/SpoonacularApiKey';

export default function Category1(props) {
  console.log('Category 1 props  :>> ', props);
  const [recipesFromApi, setRecipesFromApi] = useState(null);
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();

  useEffect(() => {
    getRecipeFromApi();
    props.navigation.setOptions({
      title: props.data.headerName,
      // headerStyle: {backgroundColor: 'yellow'},
    });
  }, []);

  const getRecipeFromApi = async () => {
    console.log('inside get recipe function');
    console.log('props.data.identifier :>> ', props.data.identifier);
    const foodItem = props.data.identifier;
    const numberOfResults = '10';
    const url = `https://api.spoonacular.com/recipes/search?apiKey=${spoonacularApiKey}&query=${foodItem}&number=${numberOfResults}&instructionsRequired=true`;
    const response = await axios.get(url);
    console.log(response);
    setRecipesFromApi(response.data.results);
    setBaseUrlSpoonacular(response.data.baseUri);
  };

  const addExtra = () => {
    // Mechanism for adding extra data in the flatlist on the go
    let arr = [...recipesFromApi];
    let pro = {
      id: 600320,
      image: 'Palak-Paneer---Restaurant-style-Punjabi-Palak-Paneer-600320.jpg',
      openLicense: 0,
      readyInMinutes: 45,
      servings: 4,
      sourceUrl: 'http://www.spiceupthecurry.com/palak-paneer/',
      title: 'Palak Paneer | Restaurant style Punjabi Palak Paneer',
    };
    arr.push(pro);
    console.log('arr :>> ', arr);
    setRecipesFromApi(arr);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.parentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContentContainerStyle}>
          <SearchFixed renderDetails={props} />
          {recipesFromApi && (
            <FlatList
              style={styles.flatlistStyle}
              data={recipesFromApi}
              extraData={recipesFromApi}
              keyExtractor={item => item.name}
              numColumns={2}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.flatlistParentContainer}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        let data = {
                          name: item.title,
                          itemId: item.id,
                          imageUrl: `${baseUrlSpoonacular + item.image}`,
                        };
                        props.navigation.navigate('RecipeDetailsScreen', data);
                      }}>
                      <Image
                        source={{uri: `${baseUrlSpoonacular + item.image}`}}
                        style={styles.flatlistImage}
                      />
                      <View style={styles.flatlistTextContainer}>
                        <Text style={styles.flatlistText}>{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = {
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  parentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '95%',
    paddingVertical: 5,
  },
  flatlistStyle: {marginVertical: 0, marginLeft: 1},
  flatlistParentContainer: {
    height: 'auto',
    width: 190,
    marginBottom: 20,
  },
  flatlistImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  flatlistTextContainer: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  flatlistText: {
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 5,
  },
  scrollViewContentContainerStyle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

// export default function Category1(props) {
//   console.log('props :>> ', props);
//   return (
//     <View>
//       <Button
//         title="Press me"
//         onPress={() => {
//           console.log('Button was pressed ');
//           props.navigation.navigate('Home');
//         }}
//       />
//     </View>
//   );
// }
