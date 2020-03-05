import React from 'react';
import {View, Text, StyleSheet, ScrollView, ImageBackground, Image , AsyncStorage} from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';

export default Sidebar = props => (
    state = {
        name : AsyncStorage.getItem('user-name')
    },
    <ScrollView>
        <Image source={require('../../assets/profile-pic.png')} style={styles.profile} />
        <Text style={styles.name}>{this.state.name}</Text>
        <Text style={styles.phone}>+91 7622907643</Text>
        <View style={{flexDirection: 'row'}}>
            <Ionicons name="md-call" size={16} color='#FFF' />
        </View>
        <View style={styles.container}>
            <DrawerNavigatorItems {...props} />
        </View>
    </ScrollView>
)

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    profile:{
        width:80,
        height: 80,
        marginTop: 40,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#FFF',
        marginLeft : 15,
    },
    name:{
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft : 15,
    },
    phone: {
        fontSize: 13,
        marginLeft : 15,
    },
    followers: {
        color: '#FFF',
        fontSize: 13,
        marginRight: 4,
    }
});