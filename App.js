import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Menu from './src/Menu';
import {AppState} from './src/State';

export default class App extends React.Component {
  appState: AppState;
  componentWillMount() {
    this.appState = new AppState();
  }

  render() {
    return (
      this.appState.gameState ? null : <Menu appState={this.appState} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
