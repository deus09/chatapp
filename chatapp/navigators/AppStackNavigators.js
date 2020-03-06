import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Addfriend from '../screens/Addfriend';
import Success from '../screens/Success';
import Home from '../screens/Home';
import Chatforum from '../screens/Chatforum.js';
import Friendlist from '../screens/Friendlist';

const AppStack = createStackNavigator({
    Login:{
        screen:Login,
        navigationOptions:{
            headerShown: false
        }  
    },
    Register:{
        screen: Register,
        navigationOptions:{
            headerShown: false
        }
    },
    Home: {
        screen: Home,
        navigationOptions:{
            headerShown: false
        }
    },
    Addfriend:{
        screen:Addfriend,
        navigationOptions:{
            headerShown: false
        }  
    },
    Success:{
        screen:Success,
        navigationOptions:{
            headerShown: false
        }  
    },
    Chatforum:{
        screen:Chatforum,
        navigationOptions:{
            headerShown: false
        }  
    },
    Friendlist: {
        screen: Friendlist,
        navigationOptions: {
            headerShown: false
        }
    }
})

const AppStackNavigator = createAppContainer(AppStack);

export default AppStackNavigator;