import React, {useState, useEffect} from 'react';
import axios from 'axios';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import spoonacularApiKey from '../../assets/constants/SpoonacularApiKey';

export default function SearchFixed(props) {
  console.log('Search fixed props :>> ', props);
  const navigation = props.renderDetails.navigation;
  const renderDetails = props.renderDetails.data;
  console.log('renderDetails :>> ', renderDetails);
  const [searchText, setSearchText] = useState('');
  const [autoCompleteList, setAutoCompleteList] = useState(null);

  const autoCompleteSearch = async text => {
    let textToComplete = `${renderDetails.identifier} ${text}`;
    console.log('textToComplete :>> ', textToComplete);
    const numberOfResults = '10';
    let url = `https://api.spoonacular.com/recipes/autocomplete?apiKey=${spoonacularApiKey}&number=${numberOfResults}&query=${textToComplete}`;
    let response = await axios.get(url);
    console.log(response);
    setAutoCompleteList(response.data);
  };

  // Template for replacing an array
  // let a = ["1", "2", "3"];
  // let b = ["4", "5", "6"];
  // console.log("a :>> ", a);
  // console.log("b :>> ", b);
  // a.splice(0, a.length);
  // a.push(...b);
  // console.log("Changed a :>> ", a);

  const x = ['1', '1', '1', '1', '1', '1', '1', '1', '1', '2', '2'];

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        paddingBottom: 10,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
      <View style={styles.searchBox}>
        <Text style={{marginLeft: 10, textTransform: 'capitalize'}}>
          {renderDetails.identifier}
        </Text>
        <TextInput
          style={{width: '85%'}}
          onChangeText={text => {
            console.log(text);
            setSearchText(text);
            autoCompleteSearch(text);
          }}
          value={searchText}
        />
      </View>

      <View style={styles.searchIcon}>
        <Icon
          name={'search'}
          size={22}
          color={'#111'}
          onPress={() => console.log('Search was presssed')}
        />
      </View>

      {autoCompleteList && (
        <View
          style={{
            width: '100%',
            backgroundColor: '#2C3A47',
            borderRadius: 10,
            marginTop: 10,
            borderWidth: 1,
          }}>
          {autoCompleteList &&
            autoCompleteList.map(item => {
              return (
                <TouchableOpacity
                  style={{width: '100%'}}
                  onPress={() => {
                    console.log('Touchable pressed');
                    let data = {
                      name: item.title,
                      itemId: item.id,
                      // imageUrl: `${baseUrlSpoonacular + item.image}`,
                    };
                    navigation.navigate('RecipeDetailsScreen', data);
                    // setFilteredRecipes(null);
                    // setSearchText('');
                  }}>
                  <Text style={{padding: 20, color: 'white', fontSize: 16}}>
                    {item.title}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 1,
                        width: '90%',
                        backgroundColor: 'white',
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      )}
    </View>
  );
}

const styles = {
  searchBox: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    width: '91%',
    marginTop: 10,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    height: 45,
    width: '8%',
    marginTop: 10,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '1%',
  },
};
