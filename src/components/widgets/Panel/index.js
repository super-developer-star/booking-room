import React, { Component } from 'react';
import ReactStars from 'react-stars';
import Amenities from '../Amenities';
import Collapsible from 'react-collapsible';
require("./_panel.css");

class Panel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			providers: []
		};
		this.handleBook = this.handleBook.bind(this);
	}

	handleBook(room) {
		console.log(room);
	}

	componentWillReceiveProps() {
		
	}

	render() {	
		if(this.props.selectedItem === null || this.props.open === false) {
			return null;
		}

		let item = this.props.selectedItem;
		let address = item.Address1 + ', ' + item.City + ' ' + item.StateProvince + ', ' + item.PostalCode;
		let descriptions = [];
		let sections = [];

		if(item.hasMore === true) {
			let initialDesc = (item.Descriptions[0].DescriptionText.length > 105) ? item.Descriptions[0].DescriptionText.substr(0, 105) : item.Descriptions[0].DescriptionText;
			descriptions = (
				<p className="description">{initialDesc}... <a onClick={this.props.showMore}>More</a></p>
			);
		}else {
			item.Descriptions.forEach((desc, index) => {
				descriptions.push(
					<p className="description" key={`desc-${index}`}>{desc.DescriptionText}</p>
				);
			});
		}

		if(item.Providers.length > 0) {
			item.Providers.forEach((provider, index) => {
				let rooms = [];
				provider.Rooms.forEach((room, idx) => {
					rooms.push(
						<div key={`room-${index}-${idx}`} className="row">
							<div className="col-md-8"><span> {room.FullName} </span></div>
							<div className="col-md-2 text-right" style={{paddingTop: '6px'}}><span>${room.Price}</span></div>
							<div className="col-md-2 text-right"><a className="btn btn-red btn-small" onClick={()=>this.handleBook(room)}>Book</a></div>
						</div>
					);
				});
				sections.push(
					<Collapsible key={`section-${index}`} trigger={provider.Name} handleTriggerClick={()=>this.props.handleTriggerClick(provider)} open={provider.open}>
						{rooms}
					</Collapsible>
				);
			});
		}

		return (
			<div className="item-panel" id="panel">
				<a className="close" onClick={this.props.closePanel}></a>
				<h1>{item.Name}</h1>
				<div className="details">
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
					<span className="hotel-stars">{/*({item.NumberOfReviews}) reviews {item.Class}-star hotel*/}</span>
					<div className="btns">
						<a className="btn btn-red btn-small">Hotel Details</a>
						{/*
							<a href={item.Website} target="_blank" className="btn btn-red btn-small">Website</a>
							<a href={`https://www.google.com/maps/dir//${address}`} target="_blank" className="btn btn-red btn-small">Directions</a>
						*/}
					</div>					
					<div className="clearfix"></div>
				</div>
				<hr/>
				<span><b>Address: </b>{address}</span>
				<br/>
				<span><b>Phone</b>: {item.PhoneNumber}</span>
				<hr/>
				<div className="accordion">
					{sections}
				</div>
				<hr/>				
				<div className="thumb"><center><img src={item.Images.PrimaryImage.Url} role="presentation"/></center></div>
				<div className="hotel-details">
					<h2>Hotel details</h2>
					<div className="descriptions">
						{descriptions}
					</div>
					<div style={{marginBottom: "10px"}}>
						<Amenities item={item}/>
					</div>				
				</div>
			</div>
		);
	}
}

export default Panel;
