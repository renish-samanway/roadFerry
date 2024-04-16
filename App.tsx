/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import Navigator from './App/service/navigation/navigation';

const rootReducer = combineReducers({

});

const store = createStore(rootReducer);

function App(): React.JSX.Element {

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
      );
}

export default App;
