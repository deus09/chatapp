import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';

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

    submitForm = () => {
        fetch('http://13.233.7.44/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phonenumber: this.state.phonenumber,
                password: this.state.password,
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
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    <Text style={styles.text}>Chat App</Text>
                </View>
                <View style={styles.middle}>
                    <TextInput
                        placeholder='Phone Number'
                        keyboardType='number-pad'
                        style={styles.input}
                        value={this.state.phonenumber}
                        onChangeText={this.handleChange('phonenumber')}
                    />
                    <TextInput
                        placeholder="Password"
                        secureTextEntry
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={this.handleChange('password')}
                    />
                    <TouchableOpacity style={styles.submitbtn} onPress={this.submitForm}>
                        <Text style={{ alignSelf: 'center', padding: '4%' }}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottom}>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            width: '90%',
                            alignSelf: 'center',
                        }}
                    />
                    <View style={{alignItems: 'center'}}>
                        <Text>Don't have an account?</Text>
                        <Text style={{height: '1%'}}></Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={{color: 'grey'}}>Create account</Text>
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
        alignSelf: 'center'
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
    submitbtn: {
        alignSelf: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '20%',
    },
});
