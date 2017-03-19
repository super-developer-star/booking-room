import React, { Component } from 'react';
import ReactStars from 'react-stars'
import Amenities from '../../../widgets/Amenities';
import LoadingOverlay from '../../../widgets/LoadingOverlay';

class SideBar extends Component {
	render() {
		let rows = [];
		let sorts = [];
		let overlayClass = (this.props.sendingRequest) ? 'rcomui-overlay show' : 'rcomui-overlay';
		if(this.props.items && this.props.items.length > 0) {
			this.props.items.forEach((item, index) => {
				let description = (item.Descriptions[0].DescriptionText.length > 80) ? item.Descriptions[0].DescriptionText.substr(0, 80) + "..." : item.Descriptions[0].DescriptionText;;
				rows.push(
					<li key={`item-${index}`} className={(this.props.selectedItem && this.props.selectedItem.Id === item.Id)?'selected':''}>
						<a onClick={()=>this.props.handleSelectHotel(item)}>
							<div className="wrapper">
								<div className="thumb"><img src={item.Images.PrimaryThumbnail.Url} role="presentation"/></div>
								<div className="price-wrapper"><span>${item.FromPrice}</span></div>
								<div className="title">{item.Name}</div>
								<span className="details">
									<div>
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
										<span className="hotel-stars">{/*({item.NumberOfReviews}) · {item.Class}-star hotel*/}</span>
									</div>
									<div>
										<div className="wrapped">
											<span>{description}</span>
										</div>
									</div>
									<span className="space1"></span>
									<Amenities item={item}/>
								</span>
							</div>					
						</a>
					</li>	
				);		
			});
		}

		["Relevance", "Price", "Rating"].forEach((item, index) => {
			let selected = (this.props.sortby === index) ? "selected" : "";
			sorts.push(
				<a key={`sort-${index}`} className={selected} onClick={()=>this.props.handleSort(index)}>{item}</a>
			);
		});

		return (
			<div id="sidebar" className="side-bar" style={{height: this.props.height}}>
				<div className="sortby">
					<span>Sorty by: </span>
					{sorts}
				</div>
				<ul>
	                <LoadingOverlay
	                    overlayClass={overlayClass}
	                    message="Please wait..."
	                />			
					{rows}
				</ul>
			</div>
		);
	}
}

export default SideBar;
