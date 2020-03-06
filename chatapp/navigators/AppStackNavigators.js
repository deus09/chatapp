import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Addfriend from '../screens/Addfriend';
import Success from '../screens/Success';
import Home from '../screens/Home';
import Friendlist from '../screens/Friendlist';
import Chatscreen from '../screens/Chatscreen';

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
    Friendlist: {
        screen: Friendlist,
        navigationOptions: {
            headerShown: false
        }
    },
    Chat: {
        screen: Chatscreen,
        navigationOptions: {
            headerShown: false,
        }
    }
})

const AppStackNavigator = createAppContainer(AppStack);

export default AppStackNavigator;