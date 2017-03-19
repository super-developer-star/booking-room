import React, { Component } from 'react';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import LocationAutoComplete from '../../Input/LocationAutoComplete';
import Autocomplete from 'react-autocomplete';
import moment from 'moment';
import cookie from 'react-cookie';
import base64 from 'base-64';
import './_searchForm.css';

// Dummy data
import HotelsAutocompleteData from '../../../../data/HotelsAutocompleteData';

// Consts
const MAX_ROOMS = 9;
const MAX_ADULTS = 8;
const MAX_CHILDREN = 6;
const MAX_AGES = 16;
const styles = {
	item: {
		padding: '2px 6px',
		cursor: 'default'
	},

	highlightedItem: {
		color: 'white',
		background: 'hsl(200, 50%, 50%)',
		padding: '2px 6px',
		cursor: 'default'
	}
}

class SearchForm extends Component {
	constructor(props) {
		super(props);
		this.today = moment();
		this.state = {
			destination: '',
			latitude: '',
			longitude: '',
			hotel: '',
			hotelId: '',
			hotelProvider: '',
			checkIn: '',
			checkOut: '',
			checkDate: '',
			numberOfRooms: 1,
			numberOfAdults: [1],
			numberOfChildren: [],
			ages: [],
			valid: true,
			isRequiredDestination: false,
			isRequiredHotel: false
		};

		this.handleCheckDate = this.handleCheckDate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAgeChange = this.handleAgeChange.bind(this);
		this.handleSelectHotel = this.handleSelectHotel.bind(this);
		this.matchStateToTerm = this.matchStateToTerm.bind(this);
		this.handleSelectedDestinationPlace = this.handleSelectedDestinationPlace.bind(this);
	}

	componentWillMount() {
		let ages = [];
		for(let i=0; i<MAX_ROOMS; i++) {
			let row = [];
			for(let j=0; j<MAX_CHILDREN; j++) {
				row.push(0);				
			}
			ages.push(row);
		}	
		this.setState({
			ages: ages
		});
	}

	handleCheckDate(event, picker) {
		let checkIn = picker.startDate;
		let checkOut = picker.endDate;
		this.setState({
			checkIn: checkIn,
			checkOut: checkOut,
			checkDate: checkIn.format("MMMM D, YYYY") + ' - ' + checkOut.format("MMMM D, YYYY")
		});
	}	

	handleChange(type, e, value) {
		let state = this.state;
		value = (value) ? value : e.target.value;;
		
		if(type === "numberOfRooms") {
			if(value < state.numberOfRooms) {
				//Initialize the values in default
				for(let i = (state.numberOfRooms-1); i >= (value-1); i++) {
					state.numberOfAdults[i] = 1;
					state.numberOfChildren[i] = 0;
				}
			}
		}

		state[type] = value;
		this.setState(state);
	}   

	matchStateToTerm(item, value) {
		if(value === '')
			return false;
		return (item.Hotel.toLowerCase().indexOf(value.toLowerCase()) !== -1);		
	}

	handleSelectHotel(value, item) {
		this.setState({
			hotel: item.Hotel,
			hotelId: item.Id,
			hotelProvider: item.Provider,
			latitude: item.Latitude,
			longitude: item.Longitude,
			isRequiredHotel: false
		});
	}

	handleSelectedDestinationPlace(place, destination) {
		this.setState({
			isRequiredDestination: false,
			destination: destination,
			latitude: place.geometry.location.lat(),
			longitude: place.geometry.location.lng()
		});
	}

	handleSelect(type, index, e) {
		let state = this.state;
		let value =  parseInt(e.target.value, 10);

		if(state[type].length < index) {
			let len = index - state[type].length + 1;
			for(let i=0; i<len; i++) {
				let v = (type === 'numberOfAdults') ? 1 : 0;
				state[type].push(v);
			}
		}

		state[type][index] = value;
		this.setState(state);		
	}

	handleAgeChange(room, child, e) {
		let ages = this.state.ages;
		ages[room][child] = parseInt(e.target.value, 10);
		this.setState({
			ages: ages
		});
	}	

	handleSubmit(e) {
		e.preventDefault();
		let invalid = false;
		if(this.state.checkIn === '' || this.state.checkOut === '') {
			this.setState({
				valid: false
			});
			invalid = true;
		}

		if(this.state.destination === '' && this.state.hotelId === '') {
			this.setState({
				valid: false,
				isRequiredDestination: true,
				isRequiredHotel: true
			})
			invalid = true;
		}

		if(invalid === true) {
			return;
		}

		let params = this.state;
		let padding = MAX_ROOMS - params.numberOfRooms;
		if(padding > 0) {
			params.numberOfAdults.splice(params.numberOfRooms, padding);
			params.numberOfChildren.splice(params.numberOfRooms, padding);
			// params.ages.splice(params.numberOfRooms, padding);
		}

		for(let i=0; i<params.ages.length; i++) {
			params.ages[i].splice(params.numberOfChildren[i], MAX_CHILDREN-params.numberOfChildren[i]);
		}

		let rooms = [];
		for(let i=0; i<params.numberOfRooms; i++) {
			let childrenCount = (params.numberOfChildren[i]) ? params.numberOfChildren[i] : 0;
			let children = [];
			if(childrenCount) {
				for(let j=0; j<childrenCount; j++) {
					if(params.ages[i][j] === undefined)  {
						params.ages[i][j] = 0;
					}
				}
				children = params.ages[i];
			}
			rooms.push({
				Adults: (params.numberOfAdults[i]) ? params.numberOfAdults[i] : 1,
				ChildrenCount: childrenCount,
				Children: children
			});
		}
		let data = {
			Destination: this.state.destination,
			Hotel: this.state.hotel,
			HotelId: this.state.hotelId,
			HotelProvider: this.state.hotelProvider,
			SearchType : (this.state.hotelId !== '') ? 1 : 0, // 0 if Destination, 1 if Hotel.
			Latitude: this.state.latitude,
			Longitude: this.state.longitude,
			// DestinationType: null,
			CheckIn: this.state.checkIn.format("YYYY-MM-DDTHH:mm:ss"),
			CheckOut: this.state.checkOut.format("YYYY-MM-DDTHH:mm:ss"),
			Rooms: rooms
		};

		cookie.save('params', base64.encode(JSON.stringify(data)), {path: '/', maxAge: 3600*24});		
		e.target.submit();
	}

	render() {
		let rooms = [];
		let adults = [];
		let children = [];		
		let roomOptions = [];
		let ageOptions = [];

		let i = 0;

		for(i=1; i<=MAX_ROOMS; i++) {
			roomOptions.push(
				<option key={`room-${i}`} value={i}>{i}</option>
			);
		}
		for(i=1; i<=MAX_ADULTS; i++) {
			adults.push(
				<option key={`adult-${i}`} value={i}>{i}</option>
			);
		}
		for(i=0; i<=MAX_CHILDREN; i++) {
			children.push(
				<option key={`child-${i}`} value={i}>{i}</option>
			);
		}
		for(i=0; i<=MAX_AGES; i++) {
			ageOptions.push(
				<option key={`age-${i}`} value={i}>{i}</option>
			);
		}		

		for(i=0; i<this.state.numberOfRooms; i++) {
			let ages = [];
			let idx = i;
			let c = 0;
			if(this.state.numberOfChildren[i] > 0) {
				for(c=0; c<this.state.numberOfChildren[i]; c++) {
					let child = c;
					ages.push(
						<div key={`age-${i}-${c}`} className="form-group col-md-2">
							<label className="control-label">Child 1 Age</label>
							<select className="form-control valid" value={(this.state.ages[idx]) ? this.state.ages[idx][child] : 0} onChange={this.handleAgeChange.bind(this, idx, child)}>
								{ageOptions}
							</select>
						</div>						
					);
				}
			}

			rooms.push(
				<div key={`room-${i}`} className="room-row row">
					<div className="col-lg-12">
						<div className="form-group room-row-count">
							<h4>Room {i+1}</h4>
						</div>
					</div>
					<div className="col-md-3">
						<div className="form-group col-md-6">
							<label className="control-label">Adults</label>
							<select className="form-control" value={this.state.numberOfAdults[i]} onChange={this.handleSelect.bind(this, 'numberOfAdults', idx)}>
								{adults}
							</select>
						</div>
						<div className="form-group col-md-6">
							<label className="control-label">Children</label> <br/>
							<select className="form-control" value={this.state.numberOfChildren[i]} onChange={this.handleSelect.bind(this, 'numberOfChildren', idx)}>
								{children}
							</select>
						</div>
					</div>
					<div className="children col-md-9">
						{ages}
					</div>
				</div>				
			);
		}

		let checkDateRequired = (this.state.valid || (this.state.checkIn && this.state.checkOut)) ? '' : 'required';
		let isRequiredDestination = (this.state.valid || !this.state.isRequiredDestination) ? '' : 'required';
		let isRequiredHotel = (this.state.valid || !this.state.isRequiredHotel) ? '' : 'required';

		return (
			<form action="/results" id="search-form" className="form-horizontal search" onSubmit={this.handleSubmit.bind(this)}>
				<div className="panel panel-primary">
					<div className="panel-body">
						<h1><i className="fa fa-bed" aria-hidden="true"></i> Search Hotels</h1>
						<div className="row dest-search">
							<div className="dest col-md-7">
								<div className="form-group">
									<label>Destination</label>
									<LocationAutoComplete
										id="input-destination"
										className={`form-control ${isRequiredDestination}`}
										placeholder="Destination"
										value={this.state.destination}
										onPlaceSelected={this.handleSelectedDestinationPlace}
										onChange={this.handleChange.bind(this, 'destination')}/>									
								</div>
							</div>
							<div className="dest col-md-3">
								<label>Check in & out date</label>
								<DatetimeRangePicker
									opens="right"
									autoApply={true}
									locale={{format: "MMMM D, YYYY"}}
									minDate={this.today}
									onApply={this.handleCheckDate}
								>
									<input type="text" ref="checkDate" id="check-date" className={`form-control ${checkDateRequired}`} placeholder="Check in & out date" value={this.state.checkDate} readOnly/>
								</DatetimeRangePicker>
							</div>
							<div className="col-md-2">
								<div className="form-group">
									<label>RoomCount</label>
									<select className="form-control valid" value={this.state.numberOfRooms} onChange={this.handleChange.bind(this, 'numberOfRooms')}>
										{roomOptions}
									</select>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="dest col-md-7">
								<div className="form-group">
									<label>Hotel</label>
									<Autocomplete
										value={this.state.hotel}
										items={HotelsAutocompleteData}
										getItemValue={(item) => item.Hotel}
										shouldItemRender={this.matchStateToTerm}
										onChange={(event, hotel) => this.setState({ hotel })}
										onSelect={this.handleSelectHotel}
										wrapperProps={{className: "input-hotel"}}
										inputProps={{id: "input-hotel", className: "form-control " + isRequiredHotel, placeholder:"Hotel"}}
										renderItem={(item, isHighlighted) => (
											<div
												style={isHighlighted ? styles.highlightedItem : styles.item}
												key={item.Id}
											>{item.Hotel}</div>
										)}/>
								
								</div>
							</div>
						</div>
						<div id="rooms">
							{rooms}
						</div>
						<div className="row">
							<div className="form-group">
								<div className="col-md-offset-5 col-md-2 no-padding">
									<button type="submit" className="btn btn-red btn-lg">Submit</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		);
	}
}

export default SearchForm;
