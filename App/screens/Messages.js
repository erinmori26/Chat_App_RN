import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';

import {
  listenToMessages,
  createMessage,
  currentUser,
  markThreadLastRead,
} from '../firebase';

export default class Messages extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    const thread = this.props.navigation.getParam('thread'); // get thread ID

    // call read messages function (in firebase/index.js)
    this.removeMessagesListener = listenToMessages(thread._id).onSnapshot(
      querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          // if not system message
          if (!firebaseData.system) {
            // show proper user profile (display name image) next to message
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName,
            };
          }

          return data;
        });

        // console.log(messages);
        this.setState({messages});
      },
    );
  }

  componentWillUnmount() {
    const thread = this.props.navigation.getParam('thread'); // get thread ID

    // call mark read function (in firebase/index.js)
    markThreadLastRead(thread._id);
    if (this.removeMessagesListener) {
      this.removeMessagesListener();
    }
  }

  handleSend = async messages => {
    const text = messages[0].text;
    const thread = this.props.navigation.getParam('thread'); // current thread

    // call new message function (in firebase/index.js)
    return createMessage(thread._id, text);
  };

  render() {
    const user = currentUser(); // call get user function (in firebase/index.js)

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.handleSend}
        user={{
          _id: user.uid,
        }}
      />
    );
  }
}
