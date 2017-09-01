import React, { Component } from 'react';
import { browserHistory } from 'react-router';

class Search extends Component {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = { value: '' };
  }

  handleKeyPress(e) {
    /* 刪除空格 */
    const value = this.state.value.trim();
    if (e.charCode === 13 && value.length > 0) {
      browserHistory.push(`/songs?q=${value}`);
    }
  }

  handleInputChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <div className="search">
        <i className="icon ion-search" />
        <input
          className="search-input"
          placeholder="SEARCH"
          value={this.state.value}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleInputChange}
        />
      </div>
    );
  }
}

export default Search;
