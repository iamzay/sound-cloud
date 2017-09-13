import React, { Component } from 'react';
import User from '../containers/User.js';

class UserContainer extends Component {
  render() {
    const { id } = this.props.params;
    const userId = parseInt(id);

    return <User userId={userId} />;
  }
}

export default UserContainer;
