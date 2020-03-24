/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator>
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Saved" component={SavedRecipeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="RecipeDetailsScreen"
        component={RecipeDetailsScreen}
      />
    </HomeStack.Navigator>
  );
};

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
      <Button
        title="Recipe details"
        onPress={() => navigation.navigate('RecipeDetailsScreen')}
      />
    </View>
  );
}

function SavedRecipeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Saved Recipes!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>My profile!</Text>
    </View>
  );
}

function RecipeDetailsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Recipe Details Screen!</Text>
    </View>
  );
}

function shouldHeaderBeShown(route) {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : 'Home';

  if (routeName === 'Home') {
    return false;
  } else {
    return true;
  }
}

function getHeaderTitle(route) {
  console.log('route', route);
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : 'Home';
  switch (routeName) {
    case 'Home':
      return 'Home';
    case 'Saved':
      return 'Saved Recipes';
    case 'Profile':
      return 'My Profile';
  }
}

const App: () => React$Node = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="home"
            component={HomeTabNavigator}
            options={({route}) => ({
              title: getHeaderTitle(route),
              headerShown: shouldHeaderBeShown(route),
            })}
          />
          <Stack.Screen name="Saved" component={SavedRecipeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
