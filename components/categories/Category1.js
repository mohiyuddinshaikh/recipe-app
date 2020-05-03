import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

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
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import SearchFixed from '../search/SearchFixed';
import * as MiscActions from '../../store/actions/MiscActions';
import getRecipeFromApi from '../functions/GetRecipeFromApi';

export default function Category1(props) {
  console.log('Category 1 props  :>> ', props);

  let dispatch = useDispatch();
  let viewMoreCount = useSelector(state => state.miscReducer.viewMoreCount);
  const [recipesFromApi, setRecipesFromApi] = useState(null);
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();
  const [moreRecipesLoading, setMoreRecipesLoading] = useState(false);
  let viewMoreRecipes = [];
  // let viewMoreCount = 0;

  console.log('viewMoreCount :>> ', viewMoreCount);

  useEffect(() => {
    props.navigation.setOptions({
      title: props.data.headerName,
      // headerStyle: {backgroundColor: 'yellow'},
    });
  }, []);

  useEffect(() => {
    fetchRecipeFromApi();
  }, [viewMoreCount]);

  const fetchRecipeFromApi = async () => {
    let propsToSend = {...props, viewMoreCount};
    let response = await getRecipeFromApi(propsToSend);
    if (viewMoreCount == 0) {
      setRecipesFromApi(response.data.results);
    }
    setBaseUrlSpoonacular(response.data.baseUri);
    if (viewMoreCount > 0) {
      viewMoreRecipes.push(response.data.results);
      addExtra();
    }
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

  const handleViewMore = () => {
    setMoreRecipesLoading(true);
    dispatch(MiscActions.setViewMoreCount(viewMoreCount + 1));
  };

  const sendSearchObject = {
    ...props,
    placeholder: `Search ${props.data.identifier} Recipes`,
  };

  const goToDetailsScreen = item => {
    let data = {
      name: item.title,
      itemId: item.id,
      imageUrl: `${baseUrlSpoonacular + item.image}`,
    };
    props.navigation.navigate('RecipeDetailsScreen', data);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.parentContainer}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.scrollViewContentContainerStyle}>
          <SearchFixed renderDetails={sendSearchObject} showFixedText={true} />
          {recipesFromApi && (
            <FlatList
              style={styles.flatlistStyle}
              data={recipesFromApi}
              extraData={recipesFromApi}
              keyExtractor={item => item.id}
              numColumns={2}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.flatlistParentContainer}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => goToDetailsScreen(item)}>
                      <ImageBackground
                        source={{uri: `${baseUrlSpoonacular + item.image}`}}
                        style={styles.flatlistImage}>
                        <Text>Some text</Text>
                      </ImageBackground>

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
  viewMoreContainer: {
    borderWidth: 2,
    padding: 10,
    marginBottom: 15,
    borderColor: '#f4511e',
    borderRadius: 20,
  },
};
