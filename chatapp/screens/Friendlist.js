import React from 'react';
import { Text, AsyncStorage, TouchableOpacity, FlatList } from 'react-native';

export default class Friendlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usernumber: null,
            friends: [],
        }
        this.loadCredentials();
    }

    async loadCredentials() {
        const number = await AsyncStorage.getItem('phonenumber');
        this.setState({ usernumber: number });
        fetch('http://10.23.0.245:3000/getfriends', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usernumber: this.state.usernumber,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    this.setState({
                        friends: res.friend,
                    })
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    }

    enterChat = async (username) => {
        await AsyncStorage.setItem('current', username);
        this.props.navigation.navigate('Chat');
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ marginTop: '10%', alignSelf: 'center' }} onPress={() => this.enterChat(item.friend)}>
                <Text>{item.friend}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <FlatList
                data={this.state.friends}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    }
}