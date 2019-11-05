import React from 'react';
import {View} from 'react-native';

import {TextField, Button} from '../components/Form';
import {createNewThread} from '../firebase';

export default class NewThread extends React.Component {
  state = {
    name: '',
    loading: false,
  };

  handlePress = () => {
    if (this.state.name.length > 0) {
      // only click once, wait while loading
      this.setState({loading: true}, () =>
        // call add new thread function (in firebase/index.js)
        createNewThread(this.state.name)
          // back to messages screen
          .then(() => {
            this.props.navigation.pop();
          })
          .finally(() => {
            this.setState({loading: false});
          }),
      );
    }
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <TextField
          placeholder="Thread Name"
          onChangeText={name => this.setState({name})}
        />
        <Button
          onPress={this.handlePress}
          title="Create"
          disabled={this.state.loading}
        />
      </View>
    );
  }
}
