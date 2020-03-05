import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default class Chat extends React.Component {
    render(){
        return (
            <View style={styles.container}>
                <SafeAreaView style={{flex: 1}}>
                    <TouchableOpacity 
                        style={{alignItems: "flex-start", marginTop: 40, marginLeft: 10}}
                        onPress={this.props.navigation.openDrawer}
                    >
                        <FontAwesome5 name="bars" size={24} color='#161924' />
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})