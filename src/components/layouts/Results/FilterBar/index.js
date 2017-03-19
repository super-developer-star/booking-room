import React, { Component } from 'react';
import InputRange from 'react-input-range';
import ReactStars from 'react-stars'
import SelectBox from '../../../widgets/SelectBox';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import moment from 'moment';

require('bootstrap-daterangepicker/daterangepicker.css');
require('react-input-range/lib/css/index.css');
require('./_filterBar.css');

class FilterBar extends Component {
	constructor(props) {
		super(props);
		this.today = moment();

		let checkIn = '';
		let checkOut = '';
		if(this.props.filterOptions.checkIn) {
			checkIn = moment(this.props.filterOptions.checkIn, "YYYY-MM-DDTHH:mm:ss");
		}
		if(this.props.filterOptions.checkOut) {
			checkOut = moment(this.props.filterOptions.checkOut, "YYYY-MM-DDTHH:mm:ss");
		}

		this.state = {
			price: this.props.filterOptions.price,
			rating: this.props.filterOptions.rating,
			hotelClass: this.props.filterOptions.hotelClass,
			amenities: this.props.filterOptions.amenities,
			checkIn: checkIn,
			checkOut: checkOut,
			checkDate: (checkIn && checkOut) ? checkIn.format("MMMM D, YYYY") + " - " + checkOut.format("MMMM D, YYYY") : '',
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleCheckDate = this.handleCheckDate.bind(this);
	}

	componentDidMount() {

	}

	handleChange(value, type) {
		console.log(value, type);
		let state = this.state;
		state[type] = value;
		this.setState(state);
		this.props.handleFilter(value, type)
	}

	handleSearch() {
		this.props.handleSearch();
	}

	handleCheckDate(event, picker) {
        this.setState({
        	checkDate: picker.startDate.format("MMMM D, YYYY") + ' - ' + picker.endDate.format("MMMM D, YYYY")
        }, ()=> {
        	this.props.handleFilter(this.state.checkDate, 'checkDate');
        });
    }

	render() {	
		let label = '';
		return (
			<div className="filter-bar">
				<div className="pull-left">
					<img src="/img/reservationscom.jpg" alt="Reservations.com"/>	
				</div>
				<div className="pull-left">
					<div className="check-text-wrapper">
						<input type="text" defaultValue={this.props.destination} id="check-text" className="form-control ui-autocomplete-input" placeholder="Destination City, Airport or Hotel" autoComplete="off"/>
						<button type="button" className="btn btn-red search-btn btn-lg btn-block" onClick={this.handleSearch.bind(this)}>Search Hotels</button>							
						<div className="clearfix"></div>
					</div>
					<div className="filter-opts">
						<div className="check-inoutdate pull-left">
							<label>Check in & out date</label>
							<DatetimeRangePicker
								opens="right"
								autoApply={true}
								locale={{format: "MMMM D, YYYY"}}
								minDate={this.today}
								startDate={this.state.checkIn}
								endDate={this.state.checkOut}
								onApply={this.handleCheckDate}
							>
								<input type="text" id="check-date" className="form-control" placeholder="Check in & out date" value={this.state.checkDate} readOnly/>
							</DatetimeRangePicker>
						</div>
						<div className="night-rate pull-left">
							<label>Max ${this.state.price}/night</label>
							<InputRange
								maxValue={300}
								minValue={1}
								formatLabel={value => `$${value}`}
								value={this.state.price}
								onChange={(v)=>this.handleChange(v, 'price')}
								onChangeComplete={(v)=>this.props.handleFilter(v, 'price')}/>						
						</div>
						<div className="user-rating pull-left">
							<label>User Rating</label>
							<div style={{marginTop: "-5px"}}>
								<ReactStars
									count={5}
									onChange={(v)=>this.handleChange(v, 'rating')}
									size={35}
									value={this.state.rating}
									color1={'#cccccc'}
									color2={'#2bbbe4'} />
							</div>
						</div>
						<div className="hotel-class pull-left">
							<label>Hotel Class</label>
							<div>
								<SelectBox
									label="Any"
									value={this.state.hotelClass}
									onChange={(v)=>this.handleChange(v, 'hotelClass')}>
									<option value='2'>2-star</option>
									<option value='3'>3-star</option>
									<option value='4'>4-star</option>
									<option value='5'>5-star</option>
								</SelectBox>										
							</div>
						</div>
						<div className="amenities pull-left">
							<label>Amenities</label>
							<div>
								<SelectBox
									label="Any amenity"
									value={this.state.amenities}
									onChange={(v)=>this.handleChange(v, 'amenities')}
									multiple={true}>
									<option value='1'>Free Wifi</option>
									<option value='2'>Free Breakfast</option>
								</SelectBox>
							</div>
						</div>		
					</div>
				</div>	
				<div className="clearfix"></div>			
			</div>
		);
	}
}

export default FilterBar;
