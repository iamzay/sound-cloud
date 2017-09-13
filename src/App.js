import React from 'react';
import { Router, Route, Redirect } from 'react-router';
import { browserHistory, IndexRoute } from 'react-router';

import Nav from './containers/Nav.js';
import SongsContainer from './containers/SongsContainer.js';
import UserContainer from './containers/UserContainer.js';
import SongContainer from './containers/SongContainer.js';

import './styles/App.css';

class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Redirect from="/" to="/songs" />
        <Route path="/" component={Nav}>
          <IndexRoute component={SongsContainer} />
          <Route path="/songs" component={SongsContainer} />
          <Route path="/songs/:id" component={SongContainer} />
          <Route path="/users/:id" component={UserContainer} />
        </Route>
      </Router>
    );
  }
}

export default App;
