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
        const usernumber = await AsyncStorage.getItem('phonenumber');
        this.setState({usernumber: usernumber});
        const f = await AsyncStorage.getItem('friends');
        const f1 = JSON.parse(f);
        if(f1 === null)
        {
            this.setState({friends: []});
        }
        else
        {
            this.setState({friends: f1});  
        }
    }

    handleChange = key => val => {
        this.setState({ [key] : val})
    }

    addfriend = async () => {
        if(this.state.friends.includes(this.state.phonenumber) === true)
        {
            alert('Already a friend');
        }
        else
        {
            this.setState({ friends: [...this.state.friends, this.state.phonenumber] });
            await AsyncStorage.setItem('friends',JSON.stringify(this.state.friends));
        }
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
                <TextInput
                        placeholder = "Phone number"
                        style = {styles.input}
                        value={this.state.phonenumber}
                        onChangeText={this.handleChange('phonenumber')}
                />
                <TouchableOpacity onPress={this.submitform}>
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