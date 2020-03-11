import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      phonenumber: null,
      friends: [],
      chatMessages: [],
      newCount: [],
    };
    this.loadCredentials();
  }

  getmessages() {
    return fetch('http://10.23.0.245:3000/getmessages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiver: this.state.phonenumber,
      })
    })
      .then((response) => response.json())
  }

  getfriends() {
    return fetch('http://10.23.0.245:3000/getfriends', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernumber: this.state.phonenumber,
      })
    })
      .then((response) => response.json())
  }

  getdata() {
    return Promise.all([this.getmessages(), this.getfriends()]);
  }

  async getchatMessagesandId(item) {
    const temp = await AsyncStorage.getItem(this.state.phonenumber + " " + item.sender + " Messages");
    const Messages = JSON.parse(temp);
    if (Messages === null) {
      this.setState({ chatMessages: [] });
    }
    else {
      this.setState({ chatMessages: Messages });
    }
    const t = await AsyncStorage.getItem(this.state.phonenumber + " " + item.sender + " id");
    if (t === null)
      this.state.id = 1;
    else
      this.state.id = t;
  }

  async loadCredentials() {
    const phonenumber = await AsyncStorage.getItem('phonenumber');
    this.setState({ phonenumber: phonenumber, id: 0 });
    this.getdata()
      .then(([messages, friends]) => {
        if (messages.success === false || friends.success === false) {
          alert("Could not connect to database");
        }
        else {
          messages.message.map((item) => {
            this.getchatMessagesandId(item);
            const temporary = [...this.state.chatMessages, { id: this.state.id, sender: item.sender, message: item.messaage }];
            this.state.id += 1;
            this.setState({ chatMessages: temporary });
            if (this.state.newCount[item.sender] === undefined) {
              this.state.newCount[item.sender] = 1;
            }
            else {
              this.state.newCount[item.sender] += 1;
            }
          })
          const temp = friends.friend;
          this.state.id = 1;
          temp.map((item) => {
            var count = 0;
            if (this.state.newCount[item.friend] !== undefined) {
              count = this.state.newCount[item.friend];
            }
            const temporary = [...this.state.friends, { id: this.state.id, newMessages: count, friend: item.friend }];
            this.state.id += 1;
            this.setState({ friends: temporary });
          })
        }
      })
  }

  logout = async () => {
    await AsyncStorage.removeItem('phonenumber');
    this.props.navigation.navigate('Login');
  }

  enterChat = async (username) => {
    await AsyncStorage.setItem('current', username);
    this.props.navigation.navigate('Chat');
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            width: '90%',
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          style={{ marginTop: '10%', alignSelf: 'center' }}
          onPress={() => this.enterChat(item.friend)}
        >
          <Text>{item.friend}</Text>
          <Text>{item.newMessages}</Text>
        </TouchableOpacity>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            width: '90%',
            alignSelf: 'center',
          }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: '10%' }}>{this.state.phonenumber}</Text>
        <FlatList
          data={this.state.friends}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Addfriend')}>
          <Text>Add a friend</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.logout}>
          <Text> Sign out </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  }
});