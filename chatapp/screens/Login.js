import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import { encrypt, decrypt } from '../cryptography/cryptography.js';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phonenumber: null,
            password: null,
        }
        this._loadInitialState();
    }
    
    _loadInitialState = async () => {
        var value = await AsyncStorage.getItem('phonenumber');
        if (value !== null) {
            this.props.navigation.navigate('Home');
        }
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    submitForm = async () => {
        if(this.state.phonenumber === null || this.state.phonenumber.length < 1 || this.state.password === null || this.state.password.length < 1)
        {
            alert("Enter valid details");            
        }
        else
        {
            var phonenumber = await encrypt(this.state.phonenumber);
            var password = await encrypt(this.state.password);
            this.setState({ phonenumber: null, password: null });
            fetch('http://13.233.7.44/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phonenumber: phonenumber,
                    password: password,
                })
            })
                .then((response) => response.json())
                .then(async (res) => {
                    if (res.success === true) {
                        await AsyncStorage.setItem('phonenumber', res.phonenumber);
                        this.props.navigation.navigate('Home');
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
                <View style={styles.top}>
                    <Text style={styles.text}>Chat App</Text>
                </View>
                <View style={styles.middle}>
                    <TextInput
                        placeholder='Phone Number'
                        placeholderTextColor='#d3d3d3'
                        keyboardType='number-pad'
                        style={styles.input}
                        value={this.state.phonenumber}
                        onChangeText={this.handleChange('phonenumber')}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor='#d3d3d3'
                        secureTextEntry
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={this.handleChange('password')}
                    />
                    <TouchableOpacity style={styles.submitbtn} onPress={this.submitForm}>
                        <Text style={{ alignSelf: 'center', color: '#000000', padding: '4%' }}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottom}>
                    <View
                        style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 1,
                            width: '90%',
                            alignSelf: 'center',
                        }}
                    />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.Text} >Don't have an account?</Text>
                        <Text style={{ height: '1%' }}></Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={{ color: '#808080' }}>Create account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
    },
    top: {
        marginTop: '20%',
    },
    bottom: {
        marginBottom: '10%',
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#000000',
    },
    input: {
        padding: 10,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 5,
        color: '#000000',
    },
    submitbtn: {
        alignSelf: 'center',
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 5,
        width: '20%',
    },
    Text: {
        color: '#000000',
    }
});
