import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

import firebase from 'react-native-firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class Loading extends React.Component {
  // when user is authenticated, go to threads; otherwise, go to sign up
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Threads' : 'Login');
    });
  }

  componentWillUnmount() {
    if (this.removeAuthListener) {
      this.removeAuthListener();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
