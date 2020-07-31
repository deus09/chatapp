import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, FlatList, Image } from 'react-native';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: null,
      friends: [],
      refreshing: false,
    };
    this.loadCredentials();
  }

  async loadCredentials() {
    const phonenumber = await AsyncStorage.getItem('phonenumber');
    this.setState({ phonenumber: phonenumber });
    const response = await fetch('http://13.233.7.44/getfriends', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernumber: this.state.phonenumber,
      })
    })
    const res = await response.json();
    if (res.success === true) {
      this.setState({ friends: res.friend });
    }
    else {
      alert(res.message);
    }
    this.setState({refreshing: false});
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
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
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

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    },
    () => {
      this.loadCredentials();
    })
  };

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
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}    
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
    margin: '6.7%',
  },
  user: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
