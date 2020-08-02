import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { encrypt, decrypt } from '../cryptography/cryptography.js';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: null,
            lastname: null,
            Phonenumber: null,
            password: null,
            confirmPassword: null,
            tempfirstname: null,
            templastname: null,
            tempPhonenumber: null,
            temppassword: null,
            tempconfirmPassword: null,
        }
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    userDoesnotexit = () => {
        fetch('http://13.233.7.44/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstname: this.state.tempfirstname,
                lastname: this.state.templastname,
                Phonenumber: this.state.tempPhonenumber,
                password: this.state.temppassword,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    this.props.navigation.navigate('Success');
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    }

    submitForm = async () => {
        if (this.state.firstname === null || this.state.firstname.length < 1 || this.state.lastname === null || this.state.lastname.length < 1 || this.state.Phonenumber === null || this.state.Phonenumber.length < 10 || this.state.password === null || this.state.password.length < 1) {
            alert('Details are not valid');
        }
        else if (this.state.password != this.state.confirmPassword) {
            alert('Passwords do not match');
        }
        else {
            this.setState({
                tempfirstname: await encrypt(this.state.firstname),
                templastname: await encrypt(this.state.lastname),
                tempPhonenumber: await encrypt(this.state.Phonenumber),
                temppassword: await encrypt(this.state.password),
                tempconfirmPassword: await encrypt(this.state.confirmPassword),
            })
            fetch('http://13.233.7.44/checkforexistinguser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Phonenumber: this.state.tempPhonenumber,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.success === true) {
                        this.userDoesnotexit();
                    }
                    else {
                        alert(res.message);
                    }
                })
                .done();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.top}>
                        <Text style={styles.heading}>
                            Create Account
                    </Text>
                    </View>
                    <View style={styles.middle}>
                        <TextInput
                            placeholder="First Name"
                            placeholderTextColor="#d3d3d3"
                            style={styles.input}
                            value={this.state.firstname}
                            onChangeText={this.handleChange('firstname')}
                        />
                        <TextInput
                            placeholder="Last Name"
                            placeholderTextColor="#d3d3d3"
                            style={styles.input}
                            value={this.state.lastname}
                            onChangeText={this.handleChange('lastname')}
                        />
                        <TextInput
                            placeholder="Phone Number"
                            placeholderTextColor="#d3d3d3"
                            keyboardType="number-pad"
                            style={styles.input}
                            value={this.state.Phonenumber}
                            onChangeText={this.handleChange('Phonenumber')}
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#d3d3d3"
                            secureTextEntry
                            style={styles.input}
                            value={this.state.password}
                            onChangeText={this.handleChange('password')}
                        />
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor="#d3d3d3"
                            secureTextEntry
                            style={styles.input}
                            value={this.state.confirmPassword}
                            onChangeText={this.handleChange('confirmPassword')}
                        />
                    </View>
                    <View style={styles.bottom}>
                        <TouchableOpacity
                            style={styles.submitbtn}
                            onPress={this.submitForm}
                        >
                            <Text style={styles.Text}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
    },
    heading: {
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#000000',
    },
    middle: {
        margin: '5%',
    },
    input: {
        alignSelf: 'center',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        width: '90%',
        marginBottom: '1%',
    },
    bottom: {
        marginBottom: '10%',
    },
    submitbtn: {
        alignItems: 'center',
    },
    Text: {
        color: '#000000',
    }
});