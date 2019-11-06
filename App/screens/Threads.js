import React from 'react';
import {FlatList} from 'react-native';

import firebase from 'react-native-firebase';
import {ThreadRow, Separator} from '../components/ThreadRow';
import {
  listenToThreads,
  listenToThreadTracking,
  // currentUser,
} from '../firebase';

export default class Threads extends React.Component {
  state = {
    threads: [],
    threadTracking: {}, // track what threads have been read
    // user: null, // current user that is logged in
  };

  componentDidMount() {
    // ////////
    // this.setState({user: this.currentUser()});
    // const {currentUser} = firebase.auth();
    // this.setState({currentUser});
    // ////////

    // call add new thread function (in firebase/index.js)
    this.removeThreadListener = listenToThreads().onSnapshot(querySnapshot => {
      const threads = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        name: '',
        latestMessage: {text: ''},
        ...doc.data(),
      }));

      this.setState({threads});
    });

    this.removeThreadListener = listenToThreadTracking().onSnapshot(
      querySnapshot => {
        // update thread tracking in state
        this.setState({threadTracking: querySnapshot.data() || {}});
      },
    );
  }

  // like log out
  componentWillUnmount() {
    if (this.removeThreadListener) {
      this.removeThreadListener();
    }

    if (this.removeThreadListener) {
      this.removeThreadListener();
    }
  }

  // check if thread unread
  isThreadUnread = thread => {
    const {threadTracking} = this.state;

    // if thread not read OR new message in thread since last check
    if (
      !threadTracking[thread._id] ||
      threadTracking[thread._id].lastRead < thread.latestMessage.createdAt
    ) {
      return true;
    }

    return false; // don't leave anything unread unnecessarily
  };

  render() {
    return (
      <FlatList
        data={this.state.threads}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <ThreadRow
            {...item}
            onPress={() =>
              this.props.navigation.navigate('Messages', {thread: item})
            }
            unread={this.isThreadUnread(item)}
          />
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    );
  }
}

// componentDidMount() {
//   this.removeThreadListener = firebase
//     .firestore()
//     .collection('MESSAGE_THREADS')
//     // order message list by date
//     .orderBy('latestMessage.createdAt', 'desc')
//     // message thread that you are on
//     .onSnapshot(querySnapshot => {
//       // map over snapshot
//       const threads = querySnapshot.docs.map(doc => ({
//         _id: doc.id,
//         name: '',
//         latestMessage: {text: ''},
//         ...doc.data(), // go over sample data
//       }));

//       this.setState({threads});
//     });
// }
