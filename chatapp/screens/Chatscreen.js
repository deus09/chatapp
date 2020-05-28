import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
        this.socket = io("http://13.233.7.44/");
        this.socket.on("new_message", async data => {
            const temp1 = [...this.state.chatMessages, { sender: data.sender, message: data.message }];
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
        return fetch('http://13.233.7.44/isReceiverOnline', {
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
        const receiver = await AsyncStorage.getItem('currentnumber');
        this.setState({ receiver: receiver });
        const receivername = await AsyncStorage.getItem('currentname');
        this.setState({ receivername: receivername });
        this.socket.emit("user_connected", {
            sender: this.state.sender,
        });
        const temp = await AsyncStorage.getItem(this.state.sender + " " + this.state.receiver + " Messages");
        const Messages = JSON.parse(temp);
        if (Messages === null) {
            this.setState({ chatMessages: [] });
        }
        else {
            this.setState({ chatMessages: Messages });
        }
        fetch('http://13.233.7.44/getmessages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: this.state.receiver,
                receiver: this.state.sender,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    this.setState({ temp: res.message });
                    this.state.temp.map(async (item) => {
                        const temp = [...this.state.chatMessages, { sender: receiver, message: item.message }];
                        this.setState({ chatMessages: temp });
                        await AsyncStorage.setItem(this.state.sender + " " + this.state.receiver + " Messages", JSON.stringify(temp));
                    })
                }
                else {
                    alert(res.message);
                }
            })
            .done();
        fetch('http://13.233.7.44/deletemessages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: this.state.receiver,
                receiver: this.state.sender,
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

    permenentStorage = (Currnetmessage) => {
        fetch('http://13.233.7.44/permenentStorage', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: this.state.receiver,
                receiver: this.state.sender,
                message: Currnetmessage,
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

    sendmessage = async () => {
        var chatMessage = this.state.chatMessage;
        if (chatMessage === null) {
            alert("Invalid message");
            return;
        }
        else {
            this.getInformation()
                .then(([res]) => {
                    if (res.success === true) {
                        this.socket.emit("send_message", {
                            receiver: this.state.receiver,
                            message: chatMessage,
                        });
                    }
                    else {
                        fetch('http://13.233.7.44/savemessage', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                sender: this.state.sender,
                                receiver: this.state.receiver,
                                message: chatMessage,
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
        this.permenentStorage(chatMessage);
        const temp = [...this.state.chatMessages, { sender: this.state.sender, message: chatMessage }];
        this.setState({ chatMessages: temp });
        await AsyncStorage.setItem(this.state.sender + " " + this.state.receiver + " Messages", JSON.stringify(temp));
        this.setState({ chatMessage: null });
    }

    getTextStyle(name1, name2) {
        if (name1 === name2) {
            return { alignSelf: 'flex-end', borderWidth: 1, borderRadius: 5, padding: 3, marginBottom: 3, marginRight: 7 }
        }
        else {
            return { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 5, padding: 3, marginBottom: 3, marginLeft: 7 }
        }
    }

    renderItem = ({ item }) => {
        return (
            <Text style={this.getTextStyle(this.state.sender, item.sender)}>{item.message}</Text>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 23, fontWeight: 'bold', alignSelf: 'center', marginTop: '10%' }}>{this.state.receivername}</Text>
                <View
                    style={{
                        marginTop: '1%',
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1,
                        width: '100%',
                        alignSelf: 'center',
                        marginBottom: 3,
                    }}
                />
                <FlatList
                    data={this.state.chatMessages}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <KeyboardAvoidingView behavior='padding'>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            placeholder='Type a message...'
                            style={styles.input}
                            value={this.state.chatMessage}
                            onChangeText={this.handleChange('chatMessage')}
                        />
                        <TouchableOpacity onPress={this.sendmessage}>
                            <MaterialIcons name="send" size={45} />
                        </TouchableOpacity>
                    </View>
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
        marginLeft: 2,
        padding: 10,
        marginBottom: 10,
        width: '85%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    submitbtn: {
        alignSelf: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '20%',
    },
});