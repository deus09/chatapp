import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: null,
      friends: [],
    };
    this.loadCredentials();
  }

  async loadCredentials() {
    const phonenumber = await AsyncStorage.getItem('phonenumber');
    this.setState({ phonenumber: phonenumber });
    fetch('http://10.23.0.245:3000/getfriends', {
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
      <TouchableOpacity style={{ marginTop: '10%', alignSelf: 'center' }} onPress={() => this.enterChat(item.friend)}>
        <Text>{item.friend}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.phonenumber}</Text>
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