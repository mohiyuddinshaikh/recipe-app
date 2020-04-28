import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';

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
import Icon from 'react-native-vector-icons/FontAwesome';
import spoonacularApiKey from '../../assets/constants/SpoonacularApiKey';

export default function SearchFixed(props) {
  const isFocused = useIsFocused();
  console.log('Search fixed props :>> ', props);
  const navigation = props.renderDetails.navigation
    ? props.renderDetails.navigation
    : null;
  const renderDetails = props.renderDetails.data
    ? props.renderDetails.data
    : null;
  console.log('renderDetails :>> ', renderDetails);
  const [searchText, setSearchText] = useState('');
  const [autoCompleteList, setAutoCompleteList] = useState(null);

  useEffect(() => {
    setSearchText('');
    setAutoCompleteList(null);
  }, [isFocused]);

  const autoCompleteSearch = async text => {
    if (
      renderDetails.category == 1 ||
      renderDetails.category == 3 ||
      renderDetails.category == 0
    ) {
      let textToComplete = props.showFixedText
        ? `${renderDetails.identifier} ${text}`
        : text;
      console.log('textToComplete :>> ', textToComplete);
      const numberOfResults = '10';
      let url = `https://api.spoonacular.com/recipes/autocomplete?apiKey=${spoonacularApiKey}&number=${numberOfResults}&query=${textToComplete}`;
      let response = await axios.get(url);
      console.log(response);
      setAutoCompleteList(response.data);
    }
    if (renderDetails.category == 2) {
      let textToComplete = props.showFixedText
        ? `${renderDetails.identifier} ${text}`
        : text;
      console.log('textToComplete :>> ', textToComplete);
      const numberOfResults = '10';
      let url = `https://api.spoonacular.com/recipes/autocomplete?apiKey=${spoonacularApiKey}&number=${numberOfResults}&query=${textToComplete}&type=${
        renderDetails.identifier
      }`;
      let response = await axios.get(url);
      console.log(response);
      setAutoCompleteList(response.data);
    }
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
  console.log('autoCompleteList :>> ', autoCompleteList);

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
        {props.showFixedText ? (
          <Text style={{marginLeft: 10, textTransform: 'capitalize'}}>
            {renderDetails.identifier}
          </Text>
        ) : null}

        <TextInput
          style={{width: '85%', paddingLeft: 10}}
          onChangeText={text => {
            console.log(text);
            setSearchText(text);
            autoCompleteSearch(text);
          }}
          value={searchText}
          placeholder={props.renderDetails.placeholder}
        />
        {(searchText && searchText !== null) || searchText != '' ? (
          <Icon
            style={{marginLeft: 'auto', marginRight: 10}}
            name={'close'}
            size={18}
            color={'#111'}
            onPress={() => {
              console.log('Close pressed');
              setSearchText('');
              setAutoCompleteList(null);
            }}
          />
        ) : null}
      </View>

      <View style={styles.searchIcon}>
        <Icon
          name={'search'}
          size={22}
          color={'#111'}
          onPress={() => console.log('Search was presssed')}
        />
      </View>

      {autoCompleteList && autoCompleteList.length != 0 && (
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
                    setSearchText('');
                    setAutoCompleteList(null);
                    let data = {
                      name: item.title,
                      itemId: item.id,
                    };
                    navigation.navigate('RecipeDetailsScreen', data);
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

const styles = StyleSheet.create({
  searchBox: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    width: '91%',
    marginTop: 10,
    borderRadius: 20,
    flexDirection: 'row',
    // justifyContent: 'space-around',
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
});
