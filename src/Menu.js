// @flow

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {observer} from 'mobx-react/native';
import {observable, computed, autorun} from 'mobx';
import {AppState} from './State';

export default @observer class Menu extends React.Component {
  props: {
    appState: AppState
  }

  scrollViewRef = null;

  @observable scrollY = 0;

  @computed get n(): number {
    return 9 - Math.min(
      Math.max(
        Math.floor((this.scrollY + 40) / 80),
        0
      ),
      8
    );
  }

  componentWillMount() {
    autorun(() => {
      console.log("n is now", this.n);
    })
  }

  scrollToNumber = (number: number) => {
    if (this.scrollViewRef != null) {
      this.scrollViewRef.scrollTo({x: 0, y: (9 - number) * 80});
    }
  }

  renderNumbers() {
    return [9,8,7,6,5,4,3,2,1].map(n => (
      <View style={styles.optionNumber} key={n}>
        <Text style={styles.optionNumberText}>
          {n}
        </Text>
      </View>
    ));
  }

  handleScrollViewRef = (ref: any) => {
    this.scrollViewRef = ref;
    this.scrollToNumber(this.props.appState.n);
    autorun(() => {
      this.props.appState.n = this.n;
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>dual n-back</Text>
        <View style={styles.optionContainer}>
          <Text style={styles.option}>n = </Text>
          <View style={styles.optionScrollContainer}>
             <TouchableOpacity
               style={[styles.arrowButton, styles.arrowButtonTop]}
               onPress={() => this.scrollToNumber(Math.min(this.n + 1, 9))}
               >
               <Text>up</Text>
             </TouchableOpacity>
             <ScrollView
               ref={this.handleScrollViewRef}
               scrollsToTop={false}
               style={styles.scrollViewStyle}
               snapToInterval={80}
               snapToAlignment={'center'}
               scrollEventThrottle={100}
               onScroll={e => {
                 this.scrollY = e.nativeEvent.contentOffset.y;
               }}
               >
               {this.renderNumbers()}
             </ScrollView>
             <TouchableOpacity
               style={[styles.arrowButton, styles.arrowButtonBottom]}
               onPress={() => this.scrollToNumber(Math.max(this.n - 1, 1))}>
               <Text>down</Text>
             </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity>
          <View style={styles.playButton}>
            <Text style={styles.playText}>
              play
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionContainer: {
    marginTop: 50,
    marginBottom: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    fontSize: 50
  },
  optionScrollContainer: {
    height: 150,
    width: 70,
    marginTop: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  arrowButton: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'papayawhip',
  },
  arrowButtonBottom: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  arrowButtonTop: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  optionNumber: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionNumberText: {
    fontSize: 70,
    color: 'palevioletred'
  },
  playButton: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'palevioletred',
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  playText: {
    color: 'papayawhip',
    fontSize: 30
  }

});
