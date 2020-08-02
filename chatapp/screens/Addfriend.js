import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import { encrypt, decrypt } from '../cryptography/cryptography.js';

export default class Addfriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            phonenumber: null,
            usernumber: null,
            friends: [],
            tempname: null,
            tempphonenumber: null,
        }
        this.loadCredentials();
    }

    async loadCredentials() {
        const usernumber = await AsyncStorage.getItem('phonenumber');
        this.setState({ usernumber: usernumber });
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    addfriend = () => {
        fetch('http://13.233.7.44/addfriend', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.tempname,
                usernumber: this.state.usernumber,
                phonenumber: this.state.tempphonenumber,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    alert('Successfully added!');
                    this.props.navigation.navigate('Home');
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    }

    checkforfriend = async () => {
        fetch('http://13.233.7.44/alreadyfriend', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usernumber: this.state.usernumber,
                phonenumber: this.state.tempphonenumber,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    this.addfriend();
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    }

    submitform = async () => {
        if (this.state.phonenumber === null || this.state.phonenumber.length < 10 || this.state.phonenumber === this.state.usernumber) {
            alert('Enter a valid number');
        }
        else if(this.state.name === null || this.state.name.length < 1){
            alert('Enter a valid name');
        }
        else {
            this.setState({
                tempphonenumber: await encrypt(this.state.phonenumber),
                tempname: await encrypt(this.state.name),
            });
            fetch('http://13.233.7.44/checkforexistinguser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Phonenumber: this.state.tempphonenumber,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.success === false) {
                        this.checkforfriend();
                    }
                    else {
                        alert('User does not exist');
                    }
                })
                .done();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder="Name"
                    placeholderTextColor="#d3d3d3"
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.handleChange('name')}
                />
                <TextInput
                    placeholder="Phone number"
                    placeholderTextColor="#d3d3d3"
                    keyboardType="number-pad"
                    style={styles.input}
                    value={this.state.phonenumber}
                    onChangeText={this.handleChange('phonenumber')}
                />
                <TouchableOpacity style={styles.btn} onPress={this.submitform}>
                    <Text style={styles.Text}>Add Friend</Text>
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
        backgroundColor: '#ffffff',
    },
    input: {
        padding: 10,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 5,
    },
    btn: {
        padding: '1%',
        borderWidth: 1,
        borderRadius: 5,
    },
    Text:{
        color: '#000000',
    }
})
