import '../../public/css/common.css';
import React, { Component } from 'react';
import FilterBar from '../components/layouts/Results/FilterBar';
import SideBar from '../components/layouts/Results/SideBar';
import MapContainer from '../components/layouts/Results/MapContainer';
import Panel from '../components/widgets/Panel';
import queryString from 'query-string'
import cookie from 'react-cookie';
import base64 from 'base-64';

const INTERVAL = 5000;

// Dummy data
import Hotels0 from '../data/Hotels0';
import Hotels1 from '../data/Hotels1';
import Hotels2 from '../data/Hotels2';

let intervalHandler = null;
let dataIndex = 0;

class HomePage extends Component {
    constructor(props) {
        super(props);
        let defaultHeight = window.innerHeight - 152;
        this.state = {
            destination: '',
            windowHeight: defaultHeight,
            mapHeight: defaultHeight,
            windowWidth: window.innerWidth,
            selectedItem: null,
            mapZoom: 14,
            openedPanel: false,
            sendingRequest: false,
            allItems: [],
            filteredItems: [],
            filterOptions: {
                sortby: 0,
                price: 300,
                checkIn: null,
                checkOut: null,
                rating: 4,
                hotelClass: 3,
                amenities: []
            },
            defaultPropertyId: null
        };
        this.handleResize = this.handleResize.bind(this);
        this.handleSelectHotel = this.handleSelectHotel.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.closePanel = this.closePanel.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.loadItems = this.loadItems.bind(this);    
        this.showMore = this.showMore.bind(this);    
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
        this.selecteDefaultHotel = this.selecteDefaultHotel.bind(this);
        this.keepTopSelectedItem = this.keepTopSelectedItem.bind(this);
    }

    handleResize(e) {
        let wHeight = window.innerHeight - 152;
        let panelHeight = wHeight;
        let panel = document.getElementById('panel');
        if(panel) {
            panelHeight = document.getElementById('panel').offsetHeight + 14;
        }
        this.setState({
	        windowHeight: wHeight,
	        windowWidth: window.innerWidth,
            mapHeight: (wHeight > panelHeight) ? wHeight : panelHeight
        });
    }

    componentWillMount() {
        let params = cookie.load('params');
        if(params) {
            params = JSON.parse(base64.decode(params));
            let filterOptions = this.state.filterOptions;
            filterOptions.checkIn = params.CheckIn;
            filterOptions.checkOut = params.CheckOut;
            this.setState({
                destination: params.Destination,
                filterOptions: filterOptions
            });
        }

        params = queryString.parse(location.search);
        if(params.hotel && params.hotel >= 0) {
            this.setState({
                defaultPropertyId: parseInt(params.hotel, 10)
            });
        }
    }

    selecteDefaultHotel(properties, callback) {
        if(this.state.defaultPropertyId === null || this.state.selectedItem !== null) {
            return;
        }

        if(properties.length > 0) {
            let _this = this;
            properties.forEach((property, index) => {
                if(property.Id === _this.state.defaultPropertyId) {
                    _this.handleSelectHotel(property);                    
                    return;
                }
            });
        }
    }

    keepTopSelectedItem(properties) {
        // if there is hotel in querystring, keep that hotel at the top of the left hotel list unless they sort/filter
        if(this.state.defaultPropertyId === null) {
            return properties;
        }

        let ret = [];
        if(properties.length > 0) {
            let _this = this;
            let defaultProperty = null;
            properties.forEach((property, index) => {
                if(property.Id !== _this.state.defaultPropertyId) {
                    ret.push(property);                    
                }else {
                    defaultProperty  = property;
                }
            });

            if(defaultProperty !== null) {
                ret.splice(0, 0, defaultProperty); 
            }
        }
        return ret;
    }

    componentDidMount() {
        let _this = this;
        let Hotels = [Hotels0, Hotels1, Hotels2];

        this.setState({
            allItems: Hotels[0].Properties,
            filteredItems: Hotels[0].Properties,
        });
        this.selecteDefaultHotel(Hotels[0].Properties);

        if(Hotels[0].SearchResultStatus !== 1) {
            // Will call the api every second until Hotels.SearchResultStatus = 1
            intervalHandler = setInterval(
                function(){
                    dataIndex++;
                    let selectedItem = null;
                    let hotelData = Hotels[dataIndex];

                    _this.selecteDefaultHotel(hotelData.Properties);
                    
                    hotelData.Properties.forEach((property, index) => {
                        if(_this.state.selectedItem && _this.state.selectedItem.Id === property.Id) {
                            selectedItem = property;              
                            selectedItem.Providers.forEach((provider, index) => {
                                provider['open'] = (_this.state.selectedItem.Providers[index]) ? _this.state.selectedItem.Providers[index].open : true;
                            });
                            selectedItem['hasMore'] = _this.state.selectedItem.hasMore;
                        }
                    });
                    _this.setState({
                        selectedItem: selectedItem
                    }, ()=> {
                        _this.setState({
                            allItems: hotelData.Properties,
                            filteredItems: _this.keepTopSelectedItem(hotelData.Properties),
                        },()=> {
                            _this.handleResize();
                        });
                    });     

                    if(hotelData.SearchResultStatus === 1) {
                        clearInterval(intervalHandler);
                    }
                }, 
            INTERVAL);    
        }

        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    showMore() {
        let item = this.state.selectedItem;
        item['hasMore'] = false;
        this.setState({
            selectedItem: item
        },  ()=> {
            this.handleResize();            
        });
    }

    handleTriggerClick(provider) {
        let selectedId = provider.Id;
        let selectedItem = this.state.selectedItem;
        let providers = selectedItem.Providers;
        providers.forEach((provider, index) => {
            if(provider.Id === selectedId) {
                provider.open =  !provider.open;
            }
        });

        selectedItem.Providers = providers;
        this.setState({
            selectedItem: selectedItem
        });
    }    

    handleSelectHotel(item) {
        item['hasMore'] = true;
        item.Providers.forEach((provider, index) => {
            provider['open'] = true;
        });

        this.setState({
            openedPanel: true,
            selectedItem: item,
            mapZoom: 16
        },()=> {
            let _this = this;
            setTimeout(function(){
                let wHeight = window.innerHeight - 152;
                let panelHeight = document.getElementById('panel').offsetHeight + 14;
                _this.setState({
                    windowHeight: wHeight,
                    mapHeight: (wHeight > panelHeight) ? wHeight : panelHeight
                }, ()=>{
                    var x = (_this.state.windowWidth + 403) / 2;
                    var y = 152 + document.getElementById('sidebar').offsetHeight / 2 - 12;
                    var ev = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'screenX': x,
                        'screenY': y
                    });
                    var el = document.elementFromPoint(x, y);
                    el.dispatchEvent(ev);                  
                });
            }, 200);
        });
    }

    handleSearch() {
        this.setState({
            sendingRequest: true
        }, ()=>{
            this.loadItems();
        });
    }

    closePanel() {
        this.setState({
            openedPanel: false
        })
    }

    handleSort(sortby) {
        this.handleFilter(sortby, 'sortby');
    }

    loadItems() {
        let all = this.state.allItems;
        let _this = this;
        if(all.length) {
            // Filtering of price
            let filtered = [];
            all.forEach((item, index) => {
                if(item.FromPrice <= this.state.filterOptions.price) {
                    filtered.push(item);
                }
            });

            // Filtering of Hotel class


            // Sort by
            if(this.state.filterOptions.sortby === 1) {
                // Price
                var i=0, j=0;
                for(i=0; i<filtered.length-1; i++) {
                    for(j=i+1; j<filtered.length; j++) {
                        if(filtered[i].FromPrice > filtered[j].Price) {
                            var tmp = filtered[i];
                            filtered[i]= filtered[j];
                            filtered[j]= tmp;
                        }
                    }
                }
            }else if(this.state.filterOptions.sortby === 2) {
                // Rating
                for(i=0; i<filtered.length-1; i++) {
                    for(j=i+1; j<filtered.length; j++) {
                        if(filtered[i].StarRating < filtered[j].StarRating) {
                            tmp = filtered[i];
                            filtered[i]= filtered[j];
                            filtered[j]= tmp;
                        }
                    }
                }
            }


            setTimeout(function(){
                _this.setState({
                    filteredItems: filtered,
                    selectedItem: null,
                    openedPanel: false,
                    mapZoom: 14,
                    sendingRequest: false
                });
            }, 500);              
        }                
    }    

    handleFilter(value, type) {
        let filterOpt = this.state.filterOptions;
        if(type === 'checkDate') {
            var tmp = value.split(' - ');
            filterOpt['checkIn'] = tmp[0];
            filterOpt['checkOut'] = tmp[1];
        }else {
            filterOpt[type] = value;
        }
        this.setState({
            filterOptions: filterOpt,
            sendingRequest: true
        }, ()=> {
            this.loadItems();
        });
    }

	render() {
        return (
			<div className="full-container">
				<FilterBar 
                    handleSearch={this.handleSearch}
                    filterOptions={this.state.filterOptions}
                    destination={this.state.destination}
                    handleFilter={this.handleFilter}/>
				<div className="clearfix"></div>
				<SideBar 
                    height={this.state.windowHeight} 
                    items={this.state.filteredItems}
                    sortby={this.state.filterOptions.sortby}
                    selectedItem={this.state.selectedItem}
                    sendingRequest={this.state.sendingRequest}
                    handleSelectHotel={this.handleSelectHotel}
                    handleSort={this.handleSort} />
                <div className="map-container" style={{height: this.state.windowHeight}}>
                    <Panel 
                        open={this.state.openedPanel}
                        closePanel={this.closePanel}
                        showMore={this.showMore}
                        handleTriggerClick={this.handleTriggerClick}
                        selectedItem={this.state.selectedItem}/>
    				<MapContainer            
                        items={this.state.filteredItems}
                        height={this.state.mapHeight}
                        selectedItem={this.state.selectedItem}
                        zoom={this.state.mapZoom} />
                </div>
			</div>
		);
	}
}

export default HomePage;
