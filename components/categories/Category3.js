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
import {useDispatch, useSelector} from 'react-redux';
import * as MiscActions from '../../store/actions/MiscActions';
import getRecipeFromApi from '../functions/GetRecipeFromApi';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../assets/constants/Colors';
import getRecipe from '../functions/getRecipe';

export default function Category3(props) {
  let dispatch = useDispatch();
  const [recipesFromApi, setRecipesFromApi] = useState(null);
  const [baseUrlSpoonacular, setBaseUrlSpoonacular] = useState();
  const [moreRecipesLoading, setMoreRecipesLoading] = useState(false);
  let viewMoreCount = useSelector(state => state.miscReducer.viewMoreCount);
  let miscReducerState = useSelector(state => state.miscReducer);
  let viewMoreRecipes = [];
  console.log('viewMoreCount :>> ', viewMoreCount);

  useEffect(() => {
    props.navigation.setOptions({
      title: props.data.headerName,
    });
  }, []);

  useEffect(() => {
    fetchRecipeFromApi();
  }, [viewMoreCount]);

  const fetchRecipeFromApi = async () => {
    let propsToSend = {
      ...props,
      viewMoreCount,
      spoonacularKeyIndex: miscReducerState.spoonacularKeyIndex,
    };
    let response = await getRecipe(propsToSend);
    if (viewMoreCount == 0) {
      setRecipesFromApi(response.response.data.results);
    }
    setBaseUrlSpoonacular(response.response.data.baseUri);
    if (viewMoreCount > 0) {
      viewMoreRecipes.push(response.response.data.results);
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
  const sendSearchObject = {
    ...props,
    placeholder: `Search ${props.data.identifier} Recipes`,
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.parentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.scrollViewContentContainerStyle}>
          <SearchFixed renderDetails={sendSearchObject} showFixedText={true} />
          {recipesFromApi && recipesFromApi != null ? (
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
          ) : (
            <ActivityIndicator
              size={'large'}
              color={colors.themeColor}
              style={{
                display: 'flex',
                alignSelf: 'center',
                marginTop: 20,
              }}
            />
          )}
          {recipesFromApi != null ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => handleViewMore()}>
              {moreRecipesLoading ? (
                <ActivityIndicator
                  size={'large'}
                  color={colors.themeColor}
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                  }}
                />
              ) : (
                <View style={styles.viewMoreContainer}>
                  <Text style={{fontSize: 15}}> View More</Text>
                </View>
              )}
            </TouchableOpacity>
          ) : null}
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
    width: wp('47.5%'),
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  flatlistImage: {
    width: '100%',
    height: hp('25%'),
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
    borderColor: colors.themeColor,
    borderRadius: 20,
  },
});
