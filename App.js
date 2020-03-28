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
import * as Actions from './store/actions/SaveAction';
import {useDispatch, useSelector} from 'react-redux';
// import {createStore} from 'redux';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import saveReducer from './store/reducer/SaveReducer';
import setIsCallerSavedScreen from './store/reducer/MiscReducer';
import HomeScreen1 from './components/HomeScreen';
import SavedRecipeScreen1 from './components/SavedRecipeScreen1';
import RecipeDetailsScreen1 from './components/RecipeDetailsScreen1';
import Icon from 'react-native-vector-icons/FontAwesome';
import RecipeInstructionsScreen from './components/RecipeInstructionsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Saved') {
            iconName = 'save';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#f4511e',
        inactiveTintColor: 'gray',
      }}>
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Saved" component={SavedRecipeScreen1} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const HomeStackNavigator = ({navigation, route}) => {
  if (route.state) {
    navigation.setOptions({
      tabBarVisible: route.state.index > 0 ? false : true,
    });
  }
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen1}
        options={{
          title: 'Recipe App',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
        }}
      />
      <HomeStack.Screen
        name="RecipeDetailsScreen"
        component={RecipeDetailsScreen1}
        options={{
          title: 'Recipe Details Screen',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
        }}
      />
      <HomeStack.Screen
        name="RecipeInstructionsScreen"
        component={RecipeInstructionsScreen}
        options={{
          title: 'Recipe Instruction Screen',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
        }}
      />
    </HomeStack.Navigator>
  );
};

function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const data = {
    name: 'Chips',
    brand: 'Lays',
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
      <Button
        title="Save Recipe details"
        onPress={() => {
          navigation.navigate('RecipeDetailsScreen');
          dispatch(Actions.saveRecipe(data));
          alert('Recipe saved in saved tab!');
        }}
      />
    </View>
  );
}

function SavedRecipeScreen() {
  const userDataInStore = useSelector(state => state.recipes);
  console.log('userDataInStore', userDataInStore);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Saved Recipes!</Text>
      {userDataInStore.map((item, index) => {
        return (
          <View>
            <Text>Recipe Number {index}</Text>
            <Text>Recipe Type : {item.name}</Text>
            {/* <Text>Brand Name : {item.brand}</Text> */}
            <Text>Calories : {item.calories}</Text>
          </View>
        );
      })}
    </View>
  );
}

function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dff9fb',
      }}>
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

// const store = createStore(saveReducer);

const rootReducer = combineReducers({
  saveReducer,
  setIsCallerSavedScreen,
});
const store = createStore(rootReducer);

const App: () => React$Node = () => {
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="home"
              component={HomeTabNavigator}
              options={({route}) => ({
                title: getHeaderTitle(route),
                headerShown: shouldHeaderBeShown(route),
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
              })}
            />
            <Stack.Screen name="Saved" component={SavedRecipeScreen1} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
