import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import { playlistTags, pastDays } from '../constants/playlist.js';

class Toolbar extends Component {
  constructor(...props) {
    super(...props);
  }

  render() {
    const { q, t } = this.props;

    const tagElems = playlistTags.map((tag, index) => {
      return (
        <Link
          key={index}
          to={`/songs?q=${tag}` + (t ? `&t=${t}` : '')}
          className="toolbar-link toolbar-tag"
          activeClassName="active"
        >
          {tag}
        </Link>
      );
    });

    const dayElems = pastDays.map((days, index) => {
      return (
        <Link
          key={index}
          to={`/songs?q=${q}` + (days.toString() === t ? '' : `&t=${days}`)}
          className="toolbar-link"
          activeClassName="active"
        >
          {days + ' days'}
        </Link>
      );
    });

    return (
      <div className="toolbar">
        {tagElems}
        <div className="toolbar-filter">
          <i className="icon ion-funnel" />
          {dayElems}
        </div>
      </div>
    );
  }
}

export default Toolbar;
