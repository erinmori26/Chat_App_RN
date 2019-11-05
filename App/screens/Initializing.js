import React from 'react';
import firebase from 'react-native-firebase';

import {signIn} from '../firebase';

export default class Initializing extends React.Component {
  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged(authUser => {
      if (!authUser) {
        return signIn(); // call sign in function (in firebase/index.js)
      }

      // go to messages screen
      return this.props.navigation.navigate('Messaging');
    });
  }

  componentWillUnmount() {
    if (this.removeAuthListener) {
      this.removeAuthListener();
    }
  }

  render() {
    return null;
  }
}
