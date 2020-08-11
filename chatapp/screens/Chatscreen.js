import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, AsyncStorage, FlatList, KeyboardAvoidingView, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import io from 'socket.io-client';
import { encrypt, decrypt } from '../cryptography/cryptography.js';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

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
            decrypted: [],
            refreshing: false,
            loaded: false,
        }
        this._details();
    }

    componentDidMount() {
        this.socket = io("http://localhost:3000/");
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
        return fetch('http://localhost:3000/isReceiverOnline', {
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
        this.state.decrypted[receivername]=await decrypt(receivername);
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
        await this.state.chatMessages.map(async (item) => {
            this.state.decrypted[item.message] = await decrypt(item.message);
            console.log(this.state.decrypted[item.message]);
            this.setState({ loaded: true});
        })
        const response = await fetch('http://localhost:3000/getmessages', {
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
        const res = await response.json();
        if (res.success === true) {
            this.setState({ temp: res.message });
            this.state.temp.map(async (item) => {
                const temp1 = [...this.state.chatMessages, { sender: receiver, message: item.message }];
                this.setState({ chatMessages: temp1 });
                await AsyncStorage.setItem(this.state.sender + " " + this.state.receiver + " Messages", JSON.stringify(temp1));
                this.state.decrypted[item.message] = await decrypt(item.message);
                this.setState({loaded: true});
            })
        }
        else {
            alert(res.message);
        }
        const response1 = await fetch('http://localhost:3000/deletemessages', {
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
        const res1 = await response1.json();
        if (res1.success === false) {
            alert(res1.message);
        }
        this.setState({ refreshing: false, loaded: true });
    }

    permenentStorage = (Currnetmessage) => {
        fetch('http://localhost:3000/permenentStorage', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: this.state.sender,
                receiver: this.state.receiver,
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
        this.setState({loaded: false});
        if (chatMessage === null) {
            alert("Invalid message");
            return;
        }
        else {
            var chatMessage = await encrypt(this.state.chatMessage);
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
                .done();
        }
        this.permenentStorage(chatMessage);
        const temp = [...this.state.chatMessages, { sender: this.state.sender, message: chatMessage }];
        this.setState({ chatMessages: temp });
        await AsyncStorage.setItem(this.state.sender + " " + this.state.receiver + " Messages", JSON.stringify(temp));
        this.setState({ chatMessage: null });
        this.state.decrypted[chatMessage]= await decrypt(chatMessage);
        this.setState({loaded: true});
    }

    getTextStyle = (name1, name2) => {
        if (name1 === name2) {
            return { alignSelf: 'flex-end', color: '#000000', borderWidth: 1, borderRadius: 5, padding: 3, marginBottom: 3, marginRight: 7 }
        }
        else {
            return { alignSelf: 'flex-start', color: '#000000', borderWidth: 1, borderRadius: 5, padding: 3, marginBottom: 3, marginLeft: 7 }
        }
    }

    renderItem = ({ item }) => {
        console.log(item.message);
        console.log(this.state.decrypted[item.message]);
        return (
            <Text style={this.getTextStyle(this.state.sender, item.sender)}>{(this.state.decrypted[item.message])}</Text>
        );
    }

    handleRefresh = () => {
        this.setState({
          refreshing: true,
        },
        () => {
          this._details();
        })
      };

    handleRender = () => {
        console.log(this.state.loaded);
        if(this.state.loaded){
            return (
            <FlatList
                ref={ref => {this.scrollView = ref}}
                onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                data={this.state.chatMessages}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
            />);
        }
        else{
            return (
                <ActivityIndicator size={40}/>
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                <Text style={{ fontSize: 23, color: '#000000', fontWeight: 'bold', alignSelf: 'center' }}>{this.state.decrypted[this.state.receivername]}</Text>
                <View
                    style={{
                        marginTop: '1%',
                        borderBottomColor: '#d3d3d3',
                        borderBottomWidth: 1,
                        width: '100%',
                        alignSelf: 'center',
                        marginBottom: 3,
                    }}
                />
                </View>
                {this.handleRender()}
                <KeyboardAvoidingView
                    behavior="padding"
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            placeholder='Type a message...'
                            placeholderTextColor="#d3d3d3"
                            style={styles.input}
                            value={this.state.chatMessage}
                            onChangeText={this.handleChange('chatMessage')}
                        />
                        <TouchableOpacity onPress={this.sendmessage}>
                            <MaterialIcons name="send" color='#000000' size={45} />
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
        backgroundColor: '#ffffff',
    },
    input: {
        marginLeft: 2,
        padding: 10,
        marginBottom: 10,
        width: '85%',
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 5,
    },
    submitbtn: {
        alignSelf: 'center',
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 5,
        width: '20%',
    },
});
