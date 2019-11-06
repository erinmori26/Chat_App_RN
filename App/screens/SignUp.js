import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import firebase from 'react-native-firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 10,
  },
  button: {
    margin: 5,
    color: 'blue',
  },
  text: {
    fontSize: 20,
  },
});

export default class SignUp extends React.Component {
  state = {email: '', password: '', errorMessage: null};

  // create new user, then navigate to messaging
  handleSignUp = () => {
    if (this.state.email === '') {
      this.setState({errorMessage: 'Please enter email.'});
    } else if (this.state.password === '') {
      this.setState({errorMessage: 'Please enter password.'});
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => this.props.navigation.navigate('Messaging'))
        .catch(error => this.setState({errorMessage: error.message}));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Create Account</Text>
        {this.state.errorMessage && (
          <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({password})}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
