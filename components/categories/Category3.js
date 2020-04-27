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
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import SearchFixed from '../search/SearchFixed';
import spoonacularApiKey from '../../assets/constants/SpoonacularApiKey';
import {useDispatch, useSelector} from 'react-redux';
import * as MiscActions from '../../store/actions/MiscActions';

export default function Category3(props) {
  let dispatch = useDispatch();
  const [recipesFromApi, setRecipesFromApi] = useState(null);
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();
  const [moreRecipesLoading, setMoreRecipesLoading] = useState(false);
  let viewMoreCount = useSelector(state => state.miscReducer.viewMoreCount);
  let viewMoreRecipes = [];

  useEffect(() => {
    props.navigation.setOptions({
      title: props.data.headerName,
    });
  }, []);

  useEffect(() => {
    getRecipeFromApi();
  }, [viewMoreCount]);

  const getRecipeFromApi = async () => {
    console.log('inside get recipe function');
    console.log('props.data.identifier :>> ', props.data.identifier);
    const foodItem = props.data.identifier;
    const numberOfResults = '10';
    let offset = viewMoreCount * 11 + 1;
    console.log('offset :>> ', offset);

    const url = `https://api.spoonacular.com/recipes/search?apiKey=${spoonacularApiKey}&query=${foodItem}&number=${numberOfResults}&offset=${offset}&instructionsRequired=true`;
    const response = await axios.get(url);
    console.log(response);
    if (viewMoreCount == 0) {
      setRecipesFromApi(response.data.results);
    }
    setBaseUrlSpoonacular(response.data.baseUri);
    if (viewMoreCount > 0) {
      viewMoreRecipes.push(response.data.results);
      addExtra();
    }
  };

  const handleViewMore = () => {
    setMoreRecipesLoading(true);
    dispatch(MiscActions.setViewMoreCount(viewMoreCount + 1));
  };

  const addExtra = () => {
    // Mechanism for adding extra data in the flatlist on the go
    let arr = [...recipesFromApi];
    viewMoreRecipes[0].map(item => {
      arr.push(item);
    });
    console.log('arr :>> ', arr);
    setRecipesFromApi(arr);
    setMoreRecipesLoading(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.parentContainer}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
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
          <TouchableOpacity activeOpacity={1} onPress={() => handleViewMore()}>
            <View style={styles.viewMoreContainer}>
              {moreRecipesLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={{fontSize: 15}}> View More</Text>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  scrollViewContentContainerStyle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  viewMoreContainer: {
    borderWidth: 2,
    padding: 10,
    marginBottom: 15,
    borderColor: '#f4511e',
    borderRadius: 20,
  },
});
