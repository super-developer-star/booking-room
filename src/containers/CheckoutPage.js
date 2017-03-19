import React, { Component } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';

class CheckoutPage extends Component {
	render() {
		return (
			<div className="layout-boxed">
				<div className="wrapper no-sidebar">
					<Header/>
					<section>
						<div className="content-wrapper">
							<div className="container">
								<div className="row search-box">
									<div id="secondaryContent" className="col col-md-4 col-xs-12 col-sm-12 pull-right">
										<div className="row">
											
										</div>
									</div>

									<div id="primaryContent" className="col-md-8 col-xs-12 col-sm-12">
										<div className="row">
											
										</div>
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

export default CheckoutPage;
