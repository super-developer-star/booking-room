import React from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import ResultsPage from './containers/ResultsPage';
import CheckoutPage from './containers/CheckoutPage';

render(
	<Router history={browserHistory}>
		<Route path="/" component={HomePage} />
		<Route path="/login" component={LoginPage} />
		<Route path="/checkout" component={CheckoutPage} />
		<Route path="/results" component={ResultsPage} />
	</Router>,
	document.getElementById('root')
);