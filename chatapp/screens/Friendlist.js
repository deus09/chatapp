import React from 'react';
import { Text, AsyncStorage, TouchableOpacity, FlatList } from 'react-native';

export default class Friendlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            usernumber: null,
            friends: [],
            chatMessages: [],
            temp : [],
        }
        this.loadCredentials();
    }

    componentDidMount() {
        this.socket = io("http://10.23.0.245:3000");
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

    renderItem = async ({ item }) => {
        const newMessages = 0;
        const temp = await AsyncStorage.getItem(this.state.usernumber + " " + item.friend + " Messages");
        const Messages = JSON.parse(temp);
        if (Messages === null) {
            this.setState({ chatMessages: [] });
        }
        else {
            this.setState({ chatMessages: Messages });
        }
        const t = await AsyncStorage.getItem(this.state.usernumber + " " + item.friend + " id");
        if (t === null)
            this.state.id = 1;
        else
            this.state.id = t;
        fetch('http://10.23.0.245:3000/getmessages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: item.friend,
                receiver: this.state.usernumber,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    this.setState({ temp: res.message });
                    this.state.temp.map(async (data) => {
                        const temp = [...this.state.chatMessages, { id: this.state.id, sender: item.friend, message: data.message }];
                        this.setState({ chatMessages: temp });
                        this.state.id += 1;
                        await AsyncStorage.setItem(this.state.usernumber + " " + this.state.receiver + " Messages", JSON.stringify(temp));
                        await AsyncStorage.setItem(this.state.sender + " " + this.state.receiver + " id", this.state.id.toString());
                    })
                }
                else {
                    alert(res.message);
                }
            })
            .done();
        fetch('http://10.23.0.245:3000/deletemessages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: item.friend,
                receiver: this.state.usernumber,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === false) {
                    alert(res.message);
                }
            })
            .done();
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