import React from 'react';
import { View, Text, StyleSheet, AsyncStorage, TouchableOpacity } from 'react-native';

export default class Friendlist extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            friends: [],
        }
        this.loadCredentials();
    }

    async loadCredentials() {
        const f = await AsyncStorage.getItem('friends');
        const f1 = JSON.parse(f);
        if(f1 === null)
        {
            this.setState({friends: []});
        }
        else
        {
            this.setState({friends: f1});  
        }
    }

    async Chat(username){
        await AsyncStorage.setItem('current',username);
        this.props.navigation.navigate('Chat');
    }

    render(){
        const friends = this.state.friends.map(friend => (
            <TouchableOpacity onPress={() => this.Chat(friend)}>
                <Text key={friend}>{friend}</Text>
            </TouchableOpacity>
        ));
        return(
            <View style={styles.container}>
                <Text>friends</Text>
                {friends}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});