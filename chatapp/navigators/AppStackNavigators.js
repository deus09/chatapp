import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatScreen from '../screens/ChatScreen'
import Addfriend from '../screens/Addfriend';
import Success from '../screens/Success';
import Try from '../screens/Try';
import Chatforum from '../screens/Chatforum.js';

const AppStack = createStackNavigator({
    Home:{
        screen:HomeScreen,
        navigationOptions:{
            headerShown: false
        }  
    },
    Register:{
        screen: RegisterScreen,
        navigationOptions:{
            headerShown: false
        }
    },
    Chat: {
        screen: Try,
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
    Chatforum:{
        screen:Chatforum,
        navigationOptions:{
            headerShown: false
        }  
    },
})

const AppStackNavigator = createAppContainer(AppStack);

export default AppStackNavigator;