/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Alert,
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
import * as MiscActions from './store/actions/MiscActions';

import {useDispatch, useSelector} from 'react-redux';
// import {createStore} from 'redux';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import saveReducer from './store/reducer/SaveReducer';
import miscReducer from './store/reducer/MiscReducer';
import userReducer from './store/reducer/UserReducer';
import HomeScreen1 from './components/HomeScreen';
import SavedRecipeScreen1 from './components/SavedRecipeScreen1';
import RecipeDetailsScreen1 from './components/RecipeDetailsScreen1';
import Icon from 'react-native-vector-icons/FontAwesome';
import RecipeInstructionsScreen from './components/RecipeInstructionsScreen';
import Signup from './components/Signup';
import Login from './components/Login';
import ProfileScreen1 from './components/ProfileScreen1';
import AsyncStorage from '@react-native-community/async-storage';
import Logout from './components/Logout';
import CategoryHomescreen from './components/CategoryHomescreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          // console.log('Upar vaale ka route', route);

          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Saved') {
            iconName = 'bookmark';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarVisible: route.name === 'Home' ? false : true,
      })}
      tabBarOptions={{
        activeTintColor: '#f4511e',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Saved" component={SavedRecipeScreen1} />
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen1} />
    </Tab.Navigator>
  );
};

const HomeStackNavigator = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isLogInFromState = useSelector(state => state.miscReducer.isLoggedIn);
  const showLoginScreenFromState = useSelector(
    state => state.miscReducer.showLoginScreen,
  );
  const showSearchBar = useSelector(state => state.miscReducer.showSearchBar);

  const [isLoggedIn, setIsLoggedIn] = useState(isLogInFromState);
  const [showLoginScreen, setShowLoginScreen] = useState(
    showLoginScreenFromState,
  );

  useEffect(() => {
    setIsLoggedIn(isLogInFromState);
  }, [isLogInFromState]);

  useEffect(() => {
    setShowLoginScreen(showLoginScreenFromState);
  }, [showLoginScreenFromState]);

  useEffect(() => {
    dispatch(MiscActions.showLoginScreen(true));
  }, []);

  if (route.state) {
    console.log('route', route);
    console.log('route.state.index', route.state.index);
    let routeName = route.state.routes[0].name;
    console.log('ROUTE NAME', routeName);
    navigation.setOptions({
      tabBarVisible:
        routeName === 'Login' ||
        routeName === 'Signup' ||
        (routeName === 'RecipeDetailsScreen' && route.state.index > 1)
          ? false
          : true,
    });
  }

  const xscreen = () => {
    return <Text>X-screen</Text>;
  };

  return (
    <HomeStack.Navigator>
      {isLoggedIn ? (
        <>
          <HomeStack.Screen
            name="Home"
            component={HomeScreen1}
            options={{
              title: 'Recipe App',
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerShown: true,
              headerRight: () => (
                <View style={{marginRight: 18}}>
                  {showSearchBar ? (
                    <Icon
                      name={'close'}
                      size={18}
                      color={'white'}
                      onPress={() => {
                        console.log('Seacrh pressed');
                        dispatch(MiscActions.showSearchBar(false));
                      }}
                    />
                  ) : (
                    <Icon
                      name={'search'}
                      size={18}
                      color={'white'}
                      onPress={() => {
                        console.log('Seacrh pressed');
                        dispatch(MiscActions.showSearchBar(true));
                      }}
                    />
                  )}
                </View>
              ),
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
          <HomeStack.Screen
            name="CategoryHomescreen"
            component={CategoryHomescreen}
            options={{
              title: 'Category Home Screen',
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
            }}
          />
        </>
      ) : (
        <>
          {showLoginScreen ? (
            <HomeStack.Screen
              name="Login"
              component={Login}
              options={{
                title: 'Recipe App - Login',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
              }}
            />
          ) : (
            <HomeStack.Screen
              name="Signup"
              component={Signup}
              options={{
                title: 'Recipe App - Signup',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
              }}
            />
          )}
        </>
      )}
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
  userReducer,
  saveReducer,
  miscReducer,
});
const store = createStore(rootReducer);

const showHeaderRightContent = (route, navigation) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : 'Home';
  switch (routeName) {
    case 'Home':
      return null;
    case 'Saved':
      return null;
    case 'Profile':
      return (
        <View style={{marginRight: 18}}>
          <Text
            style={{color: 'white', fontSize: 16}}
            onPress={() =>
              Alert.alert(
                'Log out',
                'Are you sure you want to log out?',
                [
                  {
                    text: 'No',
                    onPress: () => {},
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      navigation.navigate('Logout');
                    },
                  },
                ],
                {cancelable: true},
              )
            }>
            Log out
          </Text>
        </View>
      );
  }
};

const App: () => React$Node = () => {
  // const isLoggedIn = useSelector(state => state.miscReducer.isLoggedIn);
  // console.log('isLoggedIn', isLoggedIn);
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="home"
              component={HomeTabNavigator}
              options={({route, navigation}) => ({
                title: getHeaderTitle(route),
                headerRight: () => showHeaderRightContent(route, navigation),
                headerRightTintColor: '#fff',
                headerShown: shouldHeaderBeShown(route),
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
              })}
            />
            <Stack.Screen name="Saved" component={SavedRecipeScreen1} />
            <Stack.Screen name="Profile" component={ProfileScreen1} />
            <Stack.Screen name="Logout" component={Logout} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
