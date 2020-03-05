import React from 'react';
import Chat from './Chat';

export const ProfileScreen = ({navigation}) =>  <Chat navigation={navigation} name="profile" />
export const Requests = ({navigation}) =>  <Chat navigation={navigation} name="Requests" />
export const ListScreen = ({navigation}) =>  <Chat navigation={navigation} name="List" />
export const SignOutScreen = ({navigation}) =>  <Chat navigation={navigation} name="SignOut" />