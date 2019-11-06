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

export default class Login extends React.Component {
  state = {email: '', password: '', errorMessage: null};

  handleLogin = () => {
    const {email, password} = this.state;

    if (email === '') {
      this.setState({errorMessage: 'Please enter email.'});
    } else if (password === '') {
      this.setState({errorMessage: 'Please enter password.'});
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(({user}) => user.updateProfile({displayName: email})) // display name is email
        .then(() => this.props.navigation.navigate('Messaging'))
        .catch(error => this.setState({errorMessage: error.message}));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
        {this.state.errorMessage && (
          <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({password})}
          value={this.state.password}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('SignUp')}
        >
          <Text>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
