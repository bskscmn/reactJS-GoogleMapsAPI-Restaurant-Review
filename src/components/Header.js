import React, { Component } from 'react';
import logo from '../images/logo.png';

class Header extends Component {

    render() {
        return (
            <nav className="navbar navbar-light bg-light">
              <a className="navbar-brand">
                <img src={logo} className="App-logo" alt="logo" />
                Restaurant Review Site
              </a>
            </nav>
        );
    }
}

export default Header;