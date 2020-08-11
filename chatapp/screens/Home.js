import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, AsyncStorage, ScrollView, ActivityIndicator } from 'react-native';
import { encrypt, decrypt } from '../cryptography/cryptography.js';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: null,
      friends: [],
      refreshing: false,
      names: [],
      loaded: false,
    };
    this.loadCredentials();
  }

  async loadCredentials() {
    const phonenumber = await AsyncStorage.getItem('phonenumber');
    this.setState({ phonenumber: phonenumber });
    const response = await fetch('http://localhost:3000/getfriends', {
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
      await this.state.friends.map( async (item) => {
        this.state.names[item.name] = await decrypt(item.name);
        this.setState({loaded: true});
      })
    }
    else
    {
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

  renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.user}
          onPress={() => this.enterChat(item.friend, item.name)}
        >
          <Text style={{ fontSize: 20, color:'#000000' , marginLeft: '3%', fontWeight: 'bold' }}>{this.state.names[item.name]}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
        </View>
        <View
          style={{
            marginTop: '1%',
            borderBottomColor: '#d3d3d3',
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

  handleRender = () => {
    if(this.state.loaded)
    {
      return (
        <FlatList
          style={styles.headingcontainer}
          data={this.state.friends}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}  
        />     
      );
    }
    else{
      <View style={styles.headingcontainer}>
        <ActivityIndicator size={40}/>
      </View>
    }
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
            <Text style={{ fontSize: 23, color: '#000000' , fontWeight: 'bold' }}>Chat App</Text>
            <TouchableOpacity onPress={this.logout}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../assets/logout.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: '#000000',
              borderBottomWidth: 1,
              width: '100%',
              alignSelf: 'center',
            }}
          />
        </View>
        {this.handleRender()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headingcontainer: {
    width: '100%',
  },
  heading: {
    padding: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  user: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
