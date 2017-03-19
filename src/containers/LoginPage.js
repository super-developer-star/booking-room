import React, { Component } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import LoginForm from '../components/widgets/Form/LoginForm';

class LoginPage extends Component {
	render() {
		return (
			<div className="layout-boxed">
				<div className="wrapper no-sidebar">
					<Header/>
					<section>
						<div className="content-wrapper">                            
							<div className="block-center mt-xl wd-xl">
								<div className="panel panel-dark panel-flat login-wrapper">
									<div className="panel-heading">
										Sign In To Continue
									</div>
									<div className="panel-body">
										<LoginForm/>
									</div>
								</div>
							</div>
						</div>
					</section>
					<Footer/>
				</div>
			</div>
		);
	}
}

export default LoginPage;
