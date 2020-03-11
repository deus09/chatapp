import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import io from 'socket.io-client';

export default class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatMessage: null,
            chatMessages: [],
            temp: [],
            sender: null,
            receiver: null,
            isReceiverOnline: null,
            socket: null,
        }
        this._details();
    }

    componentDidMount() {
        this.socket = io("http://10.23.0.245:3000");
        this.socket.on("new message", async data => {
            const temp1 = [...this.state.chatMessages, {sender: data.sender, message: data.message }];
            this.setState({ chatMessages: temp1 });
            await AsyncStorage.setItem(this.state.sender + " " + this.state.receiver + " Messages", JSON.stringify(temp1));
        });
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    componentWillUnmount() {
        this.socket.emit("Disconnect", {
            sender: this.state.sender,
        });
    }

    isReceiverOnline = () => {
        return fetch('http://10.23.0.245:3000/isReceiverOnline', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                receiver: this.state.receiver,
            })
        })
            .then((response) => response.json())
    }

    getInformation = () => {
        return Promise.all([this.isReceiverOnline()]);
    }

    async _details() {
        const sender = await AsyncStorage.getItem('phonenumber');
        this.setState({ sender: sender });
        const receiver = await AsyncStorage.getItem('current');
        this.setState({ receiver: receiver });
        this.socket.emit("user connected", {
            sender: this.state.sender,
        });
        this.isReceiverOnline();
        const temp = await AsyncStorage.getItem(this.state.sender + " " + this.state.receiver + " Messages");
        const Messages = JSON.parse(temp);
        if (Messages === null) {
            this.setState({ chatMessages: [] });
        }
        else {
            this.setState({ chatMessages: Messages });
        }
    }

    sendmessage = async () => {
        console.log(this.state.chatMessage);
        if (this.state.chatMessage === null) {
            alert("Invalid message");
            return;
        }
        else {
            this.getInformation()
                .then(([res]) => {
                    if (res.success === true) {
                        this.socket.emit("send message", {
                            receiver: this.state.receiver,
                            message: this.state.chatMessage,
                        });
                    }
                    else {
                        fetch('http://10.23.0.245:3000/savemessage', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                sender: this.state.sender,
                                receiver: this.state.receiver,
                                message: this.state.chatMessage,
                            })
                        })
                            .then((response) => response.json())
                            .then((res) => {
                                if (res.success === false) {
                                    alert(res.message);
                                }
                            })
                            .done();
                    }
                })
        }
        const temp = [...this.state.chatMessages, {sender: this.state.sender, message: this.state.chatMessage }];
        this.setState({ chatMessages: temp });
        await AsyncStorage.setItem(this.state.sender + " " + this.state.receiver + " Messages", JSON.stringify(temp));
        this.setState({ chatMessage: null });
    }

    getTextStyle(name1, name2) {
        if (name1 === name2) {
            return { alignSelf: 'flex-end' }
        }
        else {
            return { alignSelf: 'flex-start' }
        }
    }

    renderItem = ({ item }) => {
        return (
            <Text style={this.getTextStyle(this.state.sender,item.sender)}>{item.message}</Text>
        );
      }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.chatMessages}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <KeyboardAvoidingView behavior='padding'>
                    <TextInput
                        placeholder='Type a message...'
                        style={styles.input}
                        value={this.state.chatMessage}
                        onChangeText={this.handleChange('chatMessage')}
                    />
                    <TouchableOpacity style={styles.btn} onPress={this.sendmessage}>
                        <Text style={{ alignSelf: 'center' }}>send</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    input: {
        padding: 10,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: '10%',
    },
    submitbtn: {
        alignSelf: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '20%',
    },
});