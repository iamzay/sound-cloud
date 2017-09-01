import React, { Component } from 'react';

import Toolbar from './Toolbar.js';

class SongsContainer extends Component {
  render() {
    const { location: { query } } = this.props;
    return (
      <div>
        <Toolbar q={query.q ? query.q : 'house'} t={query.t} />
      </div>
    );
  }
}

export default SongsContainer;
