import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { 
  ProfileScreen, 
  Requests,
  ListScreen,  
  SignOutScreen} from './Home';
  
import SideBar from './components/SideBar'


const DrawerNavigator = createDrawerNavigator({
  ProfileScreen,
  Requests,
  ListScreen,
  SignOutScreen
},{
  contentComponent: props => <SideBar {...props} />
})

export default createAppContainer(DrawerNavigator);