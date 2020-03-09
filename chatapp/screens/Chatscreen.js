import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import io from 'socket.io-client';

export default class Chatforum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            chatMessage: null,
            chatMessages: [],
            temp: [],
            sender: null,
            receiver: null,
            isReceiverOnline: null,
        }
        this._details();
    }

    componentDidMount() {
        this.socket = io("http://10.23.0.245:3000");
        this.socket.on("new message", async data => {
            this.state.id += 1;
            this.setState({ chatMessages: [...this.state.chatMessages, { id: this.state.id, sender: data.sender, message: data.message }] });
            await AsyncStorage.setItem(this.state.receiver + ' Messages', JSON.stringify(chatMessages));
        });
    }

    async _details() {
        const sender = await AsyncStorage.getItem('phonenumber');
        this.setState({ sender: sender });
        const receiver = await AsyncStorage.getItem('current');
        this.setState({ receiver: receiver });
        const t = await AsyncStorage.getItem(this.state.receiver + " id");
        this.socket.emit("user connected", this.state.sender);
        if (t === null)
        this.state.id = 1;
        else
            this.state.id = t;
        const temp = await AsyncStorage.getItem(this.state.sender + " " + this.state.receiver + " Messages");
        const Messages = JSON.parse(temp);
        if (Messages === null) {
            this.setState({ chatMessages: [] });
        }
        else {
            this.setState({ chatMessages: Messages });
        }
        // fetch('http://10.23.0.245:3000/users/getmessages', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         sender: this.state.sender,
        //         receiver: this.state.receiver,
        //     })
        // })
        //     .then((response) => response.json())
        //     .then((res) => {
        //         if (res.success === true) {
        //             this.setState({ temp: res.message });
        //         }
        //         else {
        //             alert(res.message);
        //         }
        //     })
        //     .done();
    }

    isReceiverOnline = () => {
        fetch('http://10.23.0.245:3000/isReceiverOnline', {
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
            .then((res) => {
                if (res.success === true) {
                    this.state.isReceiverOnline = true;
                }
                else {
                    this.state.isReceiverOnline = false;
                }
            })
            .done();
    }

    sendmessage = async () => {
        this.isReceiverOnline();
        if (this.state.chatMessage === null) {
            alert("Invalid message");
        }
        else if (this.state.isReceiverOnline === true) {
            this.socket.emit("send message", {
                receiver: this.state.receiver,
                message: this.state.chatMessage,
            });
        }
        else {
            fetch('http://10.23.0.245:3000/users/savemessage', {
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
            const temp = [...this.state.chatMessages, { id: this.state.id, sender: this.state.sender, message: this.state.chatMessage }];
            this.setState({ chatMessages: temp });
            this.state.id += 1;
            await AsyncStorage.setItem(this.state.sender + " " + this.state.receiver + " Messages", JSON.stringify(temp));
            await AsyncStorage.setItem(this.state.sender + " " + this.state.receiver + " id", this.state.id.toString());
            console.log(this.state.chatMessages);
        }
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

    render() {
        const chatMessages = this.state.chatMessages.map(chatMessage => (
            <Text
                key={chatMessage.id}
                style={this.getTextStyle(this.state.sender, chatMessage.sender)}
            >
                {chatMessage.message}
            </Text>
        ));
        return (
            <View style={styles.container}>
                <ScrollView>
                    {chatMessages}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding'>
                    <TextInput
                        placeholder='Type a message'
                        style={styles.input}
                        value={this.state.chatMessage}
                        onChangeText={chatMessage => {
                            this.setState({ chatMessage });
                        }}
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