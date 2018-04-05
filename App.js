import React, { Component } from 'react';
import {
  View
} from 'react-native';

import {
  Header, Spinner
} from './src/Component/Common';

import { firebaseApp } from './src/Component/firebaseApp';

import LoginForm from './src/Component/LoginForm';
import ProfileForm from './src/Component/ProfileForm';

class App extends Component {

  state={ loggedIn: null };

  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

  renderContent() {
    switch (this.state.loggedIn) {
      case true:
    return (
      <ProfileForm />
    );
      case false:
        return <LoginForm />;
      default:
        return <Spinner />;
    }
  }

  render() {
    return (
      <View>
        <Header headerText="Authentication" />
        {this.renderContent()}
      </View>
    );
  }
}

export default App;
