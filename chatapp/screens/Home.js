import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {phonenumber: null};
    this.loadCredentials();
  }

  async loadCredentials() {
      const phonenumber = await AsyncStorage.getItem('phonenumber');
      this.setState({phonenumber: phonenumber});
  }

  logout = async () => {
    await AsyncStorage.removeItem('phonenumber');
    this.props.navigation.navigate('Login');
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.phonenumber}</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Friendlist')}>
          <Text>List of friends</Text>
        </TouchableOpacity>
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
})

