import React, { Component } from 'react';
import 'parsleyjs';
import $ from 'jquery';

class LoginPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(type, e) {
		let state = this.state;
		state[type] = e.target.value;
		this.setState(state);
	}

	handleSubmit(e) {		
		e.preventDefault();
		let form = $('#login-form').parsley();
		if(form.validate() === true) {			
			// e.target.submit();
			console.log(this.state);
		}
	}

	render() {
		return (			
			<form id="login-form" className="form-horizontal" onSubmit={this.handleSubmit}>
				<div className="form-group has-feedback">
					<input className="form-control" id="Email" name="Email" placeholder="Enter email" type="email"  value={this.state.email} onChange={this.handleChange.bind(this, 'email')} data-parsley-required="true"/>
				</div>
				<div className="form-group has-feedback">
					<input className="form-control" id="Password" name="Password" placeholder="Password" type="password" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} data-parsley-required="true"/>
				</div>
				<div className="clearfix">
					<div className="checkbox c-checkbox pull-left mt0">
						<label>
							<input id="RememberMe" name="RememberMe" type="checkbox" value="true" data-parsley-required="true"/>
							<span className="fa fa-check"></span><label htmlFor="RememberMe">Remember me?</label>
						</label>
					</div>    
				</div>
				<button type="submit" className="btn btn-red btn-block mt-lg">Login</button>
			</form>
		);
	}
}

export default LoginPage;
