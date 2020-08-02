import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default class Success extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.Text}>Account created successfully</Text>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Login')}
                >
                    <Text style={styles.Text}>Click here</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    Text:{
        color: '#000000',
    }
})