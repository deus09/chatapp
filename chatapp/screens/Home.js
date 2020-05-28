import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, FlatList, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: null,
      friends: [],
      chatMessages: [],
      // temp: null,
    };
    this.loadCredentials();
  }

  // getmessages() {
  //   return fetch('http://192.168.43.101/getmessages', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       receiver: this.state.phonenumber,
  //     })
  //   })
  //     .then((response) => response.json())
  // }

  // getfriends() {
  //   return fetch('http://192.168.43.101/getfriends', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       usernumber: this.state.phonenumber,
  //     })
  //   })
  //     .then((response) => response.json())
  // }

  // deletemessages() {
  //   return fetch('http://192.168.43.101/deletemessages', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       receiver: this.state.phonenumber,
  //     })
  //   })
  //     .then((response) => response.json())
  //     .then((res) => {
  //       if (res.success === false) {
  //         alert(res.message);
  //       }
  //     })
  //     .done();
  // }

  // getdata() {
  //   return Promise.all([this.getmessages(), this.getfriends()]);
  // }

  async getchatMessagesandId(item) {
    var temp = await AsyncStorage.getItem(this.state.phonenumber + " " + item.sender + " Messages");
    var Messages = JSON.parse(temp);
    if (Messages !== null) {
      this.setState({ chatMessages: Messages });
    }
  }

  async loadCredentials() {
    const phonenumber = await AsyncStorage.getItem('phonenumber');
    this.setState({ phonenumber: phonenumber });
    fetch('http://13.233.7.44/getfriends', {
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
      .then((res) => {
        if (res.success === true) {
          this.setState({ friends: res.friend });
        }
        else {
          alert(res.message);
        }
      })
      .done();
    // this.getdata()
    //   .then(([messages, friends]) => {
    //     if (messages.success === false || friends.success === false) {
    //       alert("Could not connect to database");
    //     }
    //     else {
    //         temp = new map();
    //       friends.friend.map((item) => {
    //         var count = 0, lastmessage = "No new messages";
    //         const temporary = [...this.state.friends, { newMessages: count, friend: item.friend, name: item.name, last: lastmessage }];
    //         this.setState({ friends: temporary });
    //       })
    //         messages.message.map(async (item) => {
    //         this.getchatMessagesandId(item);
    //         var temporary = [...this.state.chatMessages, { sender: item.sender, message: item.message }];
    //         console.log(this.state.chatMessages);
    //         console.log("Hey");
    //         console.log(temporary);
    //         await AsyncStorage.setItem(this.state.phonenumber + " " + item.sender + " Messages", JSON.stringify(temporary));
    //       })
    //     }
    //   })
    // this.deletemessages();
    // this.getdata()
    //   .then(([messages, friends]) => {
    //     if (messages.success === false || friends.success === false) {
    //       alert("Could not connect to database");
    //     }
    //     else {
    //         messages.message.map(async (item) => {
    //         this.getchatMessagesandId(item);
    //         var temporary = [...this.state.chatMessages, { sender: item.sender, message: item.message }];
    //         console.log(this.state.chatMessages);
    //         console.log("Hey");
    //         console.log(temporary);
    //         await AsyncStorage.setItem(this.state.phonenumber + " " + item.sender + " Messages", JSON.stringify(temporary));
    //       })
    //       friends.friend.map((item) => {
    //         var count = 0, lastmessage = "No new messages";
    //         const temporary = [...this.state.friends, { newMessages: count, friend: item.friend, name: item.name, last: lastmessage }];
    //         this.setState({ friends: temporary });
    //       })
    //     }
    //   })
    // this.deletemessages();
  }

  logout = async () => {
    await AsyncStorage.removeItem('phonenumber');
    this.props.navigation.navigate('Login');
  }

  enterChat = async (usernumber, name) => {
    await AsyncStorage.setItem('currentnumber', usernumber);
    await AsyncStorage.setItem('currentname', name);
    this.props.navigation.navigate('Chat');
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.names}>
        <TouchableOpacity
          style={styles.user}
          onPress={() => this.enterChat(item.friend, item.name)}
        >
          <Text style={{ fontSize: 20, marginLeft: '3%', fontWeight: 'bold' }}>{item.name}</Text>
          {/* <Text style={{ fontSize: 20, marginRight: '4%' }}>{item.newMessages}</Text> */}
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          {/* <AntDesign style={{ marginLeft: '2.5%' }} name="caretright" size={12} color="black" /> */}
          {/* <Text style={{ fontSize: 12 }}>    {item.last}</Text> */}
        </View>
        <View
          style={{
            marginTop: '1%',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            width: '100%',
            alignSelf: 'center',
          }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container} >
        <View style={styles.headingcontainer}>
          <View style={styles.heading}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Addfriend')}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../assets/addfriend.png')}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 23, fontWeight: 'bold' }}>Chat App</Text>
            <TouchableOpacity onPress={this.logout}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../assets/logout.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              width: '100%',
              alignSelf: 'center',
            }}
          />
        </View>
        <FlatList
          style={styles.headingcontainer}
          data={this.state.friends}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
  headingcontainer: {
    width: '100%',
  },
  heading: {
    padding: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '6.7%',
  },
  user: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});