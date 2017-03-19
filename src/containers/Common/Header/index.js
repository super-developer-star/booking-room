import React, { Component } from 'react';
import "./_header.css";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        // this.handleResize = this.handleResize.bind(this);
    }

	render() {
        return (
            <header className="topnavbar-wrapper">
                <nav className="navbar topnavbar">
                    <div className="navbar-header">
                        <a href="./" className="navbar-brand">
                            <div className="brand-logo">
                                <img src="/img/r.jpg" alt="R Logo" className="img-responsive"/>
                            </div>
                            <div className="brand-logo-collapsed">
                                <img src="/img/r.jpg" alt="R Logo" className="img-responsive"/>
                            </div>
                        </a>
                    </div>
                    <div className="nav-wrapper">
                        <ul className="nav navbar-nav">
                            <li>
                                <a href="#">
                                <img src="/img/logo.png" alt="" className="block-center img-rounded"/>
                                </a>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a className="register-link" href="/Account/Register">Register</a></li>
                        </ul>
                    </div>
                </nav>
            </header>
		);
	}
}

export default Header;
