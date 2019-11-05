import firebase from 'react-native-firebase';
import {uniqueNamesGenerator} from 'unique-names-generator';

// get current user function (in messages)
export const currentUser = () => firebase.auth().currentUser.toJSON();

// sign in function (in initializing)
export const signIn = () =>
  firebase
    .auth()
    .signInAnonymously()
    .then(({user}) =>
      user.updateProfile({displayName: uniqueNamesGenerator()}),
    );

// read past messages and add to thread (in messages)
export const listenToMessages = threadId =>
  firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    .doc(threadId)
    .collection('MESSAGES')
    // order message list by date
    .orderBy('createdAt', 'desc');

// create new messages function (in messages)
export const createMessage = async (threadId, text) => {
  const user = firebase.auth().currentUser.toJSON(); // get user info

  // access data already in firebase
  await firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    .doc(threadId)
    .set(
      {
        latestMessage: {
          text,
          createdAt: new Date().getTime(), // update time for sorting
        },
      },
      {merge: true}, // merge texts together, don't overwrite
    );

  // return to add to firebase
  return firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    .doc(threadId)
    .collection('MESSAGES')
    .add({
      text,
      createdAt: new Date().getTime(),
      user: {
        _id: user.uid,
        displayName: user.displayName,
      },
    });
};

// create new thread function (in new thread)
export const createNewThread = name =>
  firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    .add({
      name,
      latestMessage: {
        text: `${name} created.`,
        createdAt: new Date().getTime(),
      },
    })
    .then(docRef => {
      docRef.collection('MESSAGES').add({
        text: `${name} created.`,
        createdAt: new Date().getTime(),
        system: true,
      });
    });

// display threads/messages function (in threads)
export const listenToThreads = () =>
  firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    // order message list by date
    .orderBy('latestMessage.createdAt', 'desc');

// mark thread last read with current date/time (in messages)
export const markThreadLastRead = threadId => {
  const user = currentUser();
  return firebase
    .firestore()
    .collection('USER_THREAD_TRACK')
    .doc(user.uid)
    .set(
      {
        // dynamic key
        [threadId]: {
          lastRead: new Date().getTime(),
        },
      },
      {merge: true}, // append to user thread (not overwrite)
    );
};

//
export const listenToThreadTracking = () => {
  const user = currentUser(); // get current user

  // get user ID
  return firebase
    .firestore()
    .collection('USER_THREAD_TRACK')
    .doc(user.uid);
};
