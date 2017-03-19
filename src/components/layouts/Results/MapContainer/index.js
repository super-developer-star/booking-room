import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import ReactStars from 'react-stars'
require('./_mapContainer.css');
	
class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.getCenterLocation = this.getCenterLocation.bind(this);
    }

	getCenterLocation(items) {
		if(this.props.selectedItem != null) {
			return {
				lat: this.props.selectedItem.Latitude,
				lng: this.props.selectedItem.Longitude
			};
		}

	    let minlat = false;
	    let minlng = false;
	    let maxlat = false;
	    let maxlng = false;
	    
	    items.forEach((hotel, index) => {
            if (minlat === false) { minlat = hotel.Latitude; } else { minlat = (hotel.Latitude < minlat) ? hotel.Latitude : minlat; }
            if (maxlat === false) { maxlat = hotel.Latitude; } else { maxlat = (hotel.Latitude > maxlat) ? hotel.Latitude : maxlat; }
            if (minlng === false) { minlng = hotel.Longitude; } else { minlng = (hotel.Longitude < minlng) ? hotel.Longitude : minlng; }
            if (maxlng === false) { maxlng = hotel.Longitude; } else { maxlng = (hotel.Longitude > maxlng) ? hotel.Longitude : maxlng; }
	    });

	    let lat = maxlat - ((maxlat - minlat) / 2);
	    let lng = maxlng - ((maxlng - minlng) / 2);
	    return {lat: lat, lng: lng}
	}	

	render() {
		let markers = [];
		let center = [0, 0];

		if(this.props.items && this.props.items.length > 0) {
			center = this.getCenterLocation(this.props.items);

			this.props.items.forEach((item, index) => {
				markers.push(
					<Marker 
						position={[item.Latitude, item.Longitude]} 
						key={`marker-${index}`}
						openPopup={true}>
						<Popup>
							<div className="details">
								<div>{item.Name}</div>
								<span className="rate">{item.StarRating}</span>
								<div className="rating">
									<ReactStars
										count={5}
										size={18}
										value={item.StarRating}
										edit={false}
										color1={'#cccccc'}
										color2={'#2bbbe4'} />		
								</div>						
								<span className="hotel-stars">({item.NumberOfReviews}) {item.Class}-star hotel</span>
								<div className="clearfix"></div>
							</div>
						</Popup>
					</Marker>
				)
			});
		}

		return (			
			<Map id="map" center={center} zoom={this.props.zoom} style={{height: this.props.height}}>
				<TileLayer
					url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
				{markers}		
			</Map>
		);
	}
}

export default MapContainer;
