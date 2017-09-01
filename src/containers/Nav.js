import React from 'react';
import { Link } from 'react-router';
import Popover from '../components/Popover.js';

import Search from './Search.js';

class Nav extends React.Component {
  render() {
    return (
      <div>
        <nav className="nav">
          <div className="nav-section">
            <div className="nav-logo">
              <i className="icon ion-radio-waves" />
            </div>
            <Link className="nav-title" to="/">
              SOUNDCLOUND
            </Link>
          </div>
          <div className="nav-section">
            <Search className="nav-search" />
            <div className="nav-user">
              <Popover>
                <div className="nav-user-link">
                  <i className="icon ion-person" />
                  <i className="icon ion-chevron-down" />
                  <i className="icon ion-chevron-up" />
                </div>
                <div className="nav-user-popover">
                  <a href="#" className="orange-block">
                    Sign into SoundCloud
                  </a>
                </div>
              </Popover>
            </div>
          </div>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

export default Nav;
