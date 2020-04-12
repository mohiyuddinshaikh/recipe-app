import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  ImageBackground,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import spoonacularApiKey from '../assets/constants/SpoonacularApiKey';

export default function RecipeInstructionsScreen({navigation, route}) {
  const itemName = route.params.name;
  const itemId = route.params.id;
  const [steps, setSteps] = useState();
  console.log('route', route);

  useEffect(() => {
    getInstructions();
    navigation.setOptions({title: 'Instructions > ' + itemName});
  }, []);

  const getInstructions = async () => {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${itemId}/analyzedInstructions?apiKey=${spoonacularApiKey}`,
    );
    console.log('response', response);
    setSteps(response.data[0].steps);
  };
  console.log('steps', steps);

  const renderInstructions = () => {
    console.log('Yaha aaye the');
    return (
      steps && (
        <View style={{paddingBottom: 30}}>
          {steps.map(item => {
            return (
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 17, marginBottom: 3}}>
                  Step {item.number} :
                </Text>
                <Text style={{fontSize: 17, marginLeft: 30}}>{item.step}</Text>
              </View>
            );
          })}
        </View>
      )
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dff9fb',
      }}>
      <View style={{display: 'flex', alignItems: 'center'}}>
        <View style={{width: '90%'}}>
          <Text
            style={{fontSize: 20, textAlign: 'center', paddingVertical: 20}}>
            Instructions
          </Text>
          {renderInstructions()}
        </View>
      </View>
    </ScrollView>
  );
}
