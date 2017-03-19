import React, { Component } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import SearchForm from '../components/widgets/Form/SearchForm';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
		// this.handleResize = this.handleResize.bind(this);
	}

	render() {
		return (
			<div className="layout-boxed">
				<div className="wrapper no-sidebar">
					<Header/>
					<section>
						<div className="content-wrapper">
							<div className="container">
								<div className="row search-box">
									<div className="col-md-12">
										<SearchForm/>
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

export default HomePage;
