import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { browserHistory } from 'react-router';

import Nav from './containers/Nav.js';
import SongsContainer from './containers/SongsContainer.js';

import './styles/App.css';

class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Nav}>
          <Route path="/songs" component={SongsContainer} />
        </Route>
      </Router>
    );
  }
}

export default App;
