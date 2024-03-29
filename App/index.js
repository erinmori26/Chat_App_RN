import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';

// import Initializing from './screens/Initializing';
import NewThread from './screens/NewThread';
import Threads from './screens/Threads';
import Messages from './screens/Messages';
import Loading from './screens/Loading';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
// import Main from './Main';

import {HeaderIcon} from './components/HeaderIcon';

const MessagingWithModal = createStackNavigator(
  {
    Messaging: createStackNavigator({
      Threads: {
        screen: Threads,
        navigationOptions: ({navigation}) => ({
          headerTitle: 'Message Threads',
          headerRight: (
            <HeaderIcon
              iconName="add"
              onPress={() => navigation.navigate('NewThread')}
            />
          ),
        }),
      },
      Messages: {
        screen: Messages,
        navigationOptions: ({navigation}) => ({
          headerTitle: navigation.getParam('thread', {}).name,
        }),
      },
    }),
    NewThread: createStackNavigator({
      NewThread: {
        screen: NewThread,
        navigationOptions: ({navigation}) => ({
          headerTitle: 'New Thread',
          headerRight: (
            <HeaderIcon iconName="close" onPress={() => navigation.pop()} />
          ),
        }),
      },
    }),
  },
  {
    headerMode: 'none',
    mode: 'modal',
  },
);

const App = createSwitchNavigator({
  Loading,
  Login,
  SignUp,
  // Initializing: {
  //   screen: Initializing,
  // },
  Messaging: {
    screen: MessagingWithModal,
  },
});

export default createAppContainer(App);
