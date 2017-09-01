import React, { Component } from 'react';

class Popover extends Component {
  constructor(props) {
    super(props);

    this.handleToggleOpen = this.handleToggleOpen.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.state = { open: false };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  handleOutsideClick(e) {
    if (!this.state.open) {
      return;
    }

    if (!this.node.contains(e.target)) {
      this.setState({ open: false });
    }
  }

  handleToggleOpen() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { children } = this.props;
    const { open } = this.state;

    return (
      <div
        className={`${open ? 'open' : ''} popover`}
        onClick={this.handleToggleOpen}
        ref={node => (this.node = node)}
      >
        {children[0]}
        {this.state.open ? children[1] : null}
      </div>
    );
  }
}

export default Popover;
