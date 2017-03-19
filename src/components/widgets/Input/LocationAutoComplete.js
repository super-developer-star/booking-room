import React, {Component} from 'react';

class LocationAutoComplete extends Component {
	constructor(props) {
		super(props);
		this.autocomplete = null;
	}

	componentDidMount() {
		let google = window.google;
		this.autocomplete = new google.maps.places.Autocomplete(this.refs.location, {
			type: ['geocode']
		});

		this.autocomplete.addListener('place_changed', this.onSelected.bind(this));
	}

	onSelected() {
		if (this.props.onPlaceSelected) {			
			let place = this.autocomplete.getPlace();
			this.props.onPlaceSelected(place, this.refs.location.value);
		}
	}

	render() {
		return (
			<input 
				id={this.props.name}
				name={this.props.name}
				className={this.props.className}
				type="text"
				ref="location"
				defaultValue={this.props.value}
				required={this.props.required}
				placeholder={this.props.placeholder}
				onChange={this.props.onChange}/>
		);
	}
}

export default LocationAutoComplete;