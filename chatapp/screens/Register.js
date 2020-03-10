import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: null,
            lastname: null,
            Phonenumber: null,
            password: null,
            confirmPassword: null,
        }
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    userDoesnotexit = () => {
        fetch('http://10.23.0.245:3000/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                Phonenumber: this.state.Phonenumber,
                password: this.state.password,
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

    submitForm = () => {
        if (this.state.password !== this.state.confirmPassword) {
            alert('Passwords do not match');
        }
        else if (this.state.firstname < 1 || this.state.lastname < 1 || this.state.Phonenumber === null || this.state.Phonenumber.length < 10) {
            alert('Details are not valid');
        }
        else {
            fetch('http://10.23.0.245:3000/checkforexistinguser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Phonenumber: this.state.Phonenumber,
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
                            style={styles.input}
                            value={this.state.firstname}
                            onChangeText={this.handleChange('firstname')}
                        />
                        <TextInput
                            placeholder="Last Name"
                            style={styles.input}
                            value={this.state.lastname}
                            onChangeText={this.handleChange('lastname')}
                        />
                        <TextInput
                            placeholder="Phone Number"
                            style={styles.input}
                            value={this.state.Phonenumber}
                            onChangeText={this.handleChange('Phonenumber')}
                        />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            style={styles.input}
                            value={this.state.password}
                            onChangeText={this.handleChange('password')}
                        />
                        <TextInput
                            placeholder="Confirm Password"
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
                            <Text>Submit</Text>
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
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    top: {
        margin: '10%'
    },
    heading: {
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold',
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
    }
});