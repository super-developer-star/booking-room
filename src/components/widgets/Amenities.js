import React, { Component } from 'react';

class Amenities extends Component {
	render() {
		let item = this.props.item;
		if(item.Amenities && item.Amenities.length === 0) {
			return null;
		}
		
		let amenities = [];
		item.Amenities.forEach((item, index) => {
			let icon = '';
			if(item.Name === "Free Breakfast") {
				icon = "free-breakfast"
			}else if(item.Name === "Free Parking") {
				icon = "free-parking"
			}else if(item.Name === "Free Wifi") {
				icon = "free-wifi"
			}

			amenities.push(
				<span key={`amenity-${index}`} className="ig">
					<span className="qg">
						<span className="rg amenity-icon">
							<span className={`has ${icon}`}></span>
						</span>
						<span className="zg">{item.Name}</span>
					</span>
				</span>
			);			
		});

		return (<div>{amenities}</div>);
	}
}

export default Amenities;
