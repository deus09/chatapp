import React from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';

export default class Addfriend extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            phonenumber: '',
            usernumber: '',
            friends: [],
        }
        this.loadCredentials();
    }
    
      async loadCredentials() {
          const friendlist = await AsyncStorage.getItem('friendlist');
          const friend = JSON.parse(friendlist); 
          const usernumber = await AsyncStorage.getItem('phonenumber');
          this.setState({usernumber: usernumber});
          this.setState({friendlists: friend});
      }

    handleChange = key => val => {
        this.setState({ [key] : val})
    }

    addfriend = () => {
        alert(this.state.friends);
        // fetch('http://10.23.0.245:3000/users/addfriend', {
        //         method: 'POST',
        //         headers: {
        //             'Accept' : 'application/json',
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             phonenumber: this.state.phonenumber,
        //             usernumber: this.state.usernumber,
        //         })
        //     })
        //     .then((response) => response.json())
        //     .then((res) => {
        //         if(res.success === true){
        //             alert('Added successfully');
        //         }
        //         else{     
        //             alert('Failed');
        //         }
        //     })
        //     .done();
        this.setState({friends: [...this.state.friends,this.state.phonenumber]});
    }

    submitform = () => {
        if(this.state.phonenumber.length < 10 || this.state.phonenumber === this.state.usernumber)
        {
            alert('Enter a valid number');
        }
        else
        {
            fetch('http://10.23.0.245:3000/users/checkforexistinguser', {
                method: 'POST',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Phonenumber: this.state.phonenumber,
                })
            })
            .then((response) => response.json())
            .then((res) => {
                if(res.success === false){
                    this.addfriend();
                }
                else{     
                    alert('User does not exists');
                }
            })
            .done();
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <Text>Dev Lathiya</Text>
                <TextInput
                        placeholder = "Phone number"
                        style = {styles.input}
                        value={this.state.phonenumber}
                        onChangeText={this.handleChange('phonenumber')}
                />
                <TouchableOpacity onPress={this.addfriend}>
                    <Text>Add Friend</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        padding: 10,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
})