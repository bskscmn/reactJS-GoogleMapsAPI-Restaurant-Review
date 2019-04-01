import React, { Component } from 'react';
import './css/App.css';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import Header from './components/Header';
import Map  from './components/Map';
import Filters  from './components/Filters';
import Places  from './components/Places';
import GooglePlaces  from './components/GooglePlaces';
import NewVenueForm from "./components/NewVenueForm";

import restaurant_pin from './images/icon-restaurant.png';
import restaurant_pin_hover from './images/hover-icon-restaurant.png';
import youarehere_pin from './images/you-are-here.png';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      map: null,
      pos: {
              lat: 39.909537, 
              lng: 32.762464
          },
      mapCenter: {
              lat: 39.909537,
              lng: 32.762464
          },
      restaurants:  require( "./myplaces.json" ),
      restaurantsinMap: [],
      filteredRestaurants: [],

      nearbyRestaurants: [],
      nearbyRestaurantsinMap: [],
      filteredNearbyRestaurants: [],

      markers: [],
      gpmarkers: [],
      minStar: 1,
      maxStar: 5,
      NE_lat: null,
      NE_lng: null,
      SW_lat: null,
      SW_lng: null,
      newlatLng: null,
      modal: false
    };
    this.handleFilterStars = this.handleFilterStars.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.saveVenue = this.saveVenue.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {

    if (window.google === null || window.google === undefined){
        document.getElementById("map").innerHTML = "No offline Version is availible";
    } else {
        this.initMap();
        this.handleRestaurantsinMap();
        this.setMarkers();

        this.handleGPinMap();
        this.setGPMarkers();
    }
    var mapCanvas = this.refs.mapDiv;

    mapCanvas.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);


  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.NE_lat !== prevState.NE_lat){
      this.handleRestaurantsinMap();
      this.handleGPinMap();
    }
    if(this.state.minStar !== prevState.minStar || this.state.maxStar !== prevState.maxStar){
      this.handlefilterRaiting();
      this.handlefilterGPRaiting();
    }

    if(this.state.restaurants !== prevState.restaurants){
      this.handleRestaurantsinMap();
    }
    if(this.state.nearbyRestaurants !== prevState.nearbyRestaurants){
      this.handleGPinMap();
    }

    if(this.state.restaurantsinMap !== prevState.restaurantsinMap){
      this.handlefilterRaiting();
    }
    if(this.state.nearbyRestaurantsinMap !== prevState.nearbyRestaurantsinMap){
      this.handlefilterGPRaiting();
    }

    if(this.state.filteredRestaurants !== prevState.filteredRestaurants){
      this.setMarkers();
    }

    if(this.state.filteredNearbyRestaurants !== prevState.filteredNearbyRestaurants){
      this.setGPMarkers();
    }
  }

  initMap = () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) { 
      navigator.geolocation.getCurrentPosition(function (position) {
        this.setState({
          pos: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
         
        /*alert(JSON.stringify(pos, null, 4));*/
        map.setCenter(this.state.pos);
        markMe.setPosition(this.state.pos);
      }.bind(this));
    } 
    let mapOptions = {
      center: this.state.pos,
      zoom: 15,
    }
    let map = new window.google.maps.Map(document.getElementById('map'), mapOptions);
   
    var imageHere = {
      url: youarehere_pin,
      // This marker is 20 pixels wide by 32 pixels high.
      size: new window.google.maps.Size(40, 40),
      // The origin for this image is (0, 0).
      origin: new window.google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new window.google.maps.Point(20, 30)
    };

    let markMe = new window.google.maps.Marker({map: map, icon: imageHere});

    this.setState({
      map: map,
    }); 

    window.google.maps.event.addListener(map, 'bounds_changed', function() {
      this.setState({
        NE_lat: map.getBounds().getNorthEast().lat(),
        NE_lng: map.getBounds().getNorthEast().lng(),
        SW_lat: map.getBounds().getSouthWest().lat(),
        SW_lng: map.getBounds().getSouthWest().lng(),
        mapCenter: {lat: map.getCenter().lat(), lng: map.getCenter().lng()}
      }); 
      this.handleRestaurantsinMap();
      this.getGooglePlaces();
      
    }.bind(this));  

      window.google.maps.event.addListener(map, "rightclick", function(event) {
      
        this.setState({ newlatLng: event.latLng });
        this.toggle();
      }.bind(this));  
  }


  handleFilterStars(e){
    const target = e.target;
    const value = target.value;
    const name = target.name;
    if (name === "minStar"){
      this.setState({
          minStar : value
      })
    }
    if (name === "maxStar"){
      this.setState({
          maxStar : value
      })
    }
  }

  handleRestaurantsinMap = () => {
    this.setState({
      restaurantsinMap:  this.filterRestaurantsBounds(),
    });

    this.handlefilterRaiting();
  }
  filterRestaurantsBounds = () => {
    return this.state.restaurants.filter((item) => {
      if((item.lat <= this.state.NE_lat && item.lat >= this.state.SW_lat)&&(item.lng <= this.state.NE_lng && item.lng >= this.state.SW_lng)){
         return item;
      }else{
        return null;
      }
    });
  }
  handlefilterRaiting =() => {
    this.setState({
      filteredRestaurants:  this.filterRestaurantsRaiting(),
    });
  }
  filterRestaurantsRaiting = () => {
    let min = this.state.minStar;
    let max = this.state.maxStar;

    return this.state.restaurantsinMap.filter((item) => {
      
      var ratings = item.ratings;
      var stars = 0;
      var total = 0;
      var average = 0;

      ratings = ratings.map(function(rating, j){
          stars = rating.stars;
          return total += stars; 
      })
      average = total/ratings.length;
      average = Math.round( average * 10 ) / 10;
     
      if(average >= min && average <= max){
        return item
      }else{
        return null;
      }
    });
  }
  setMarkers = () => {
    let map = this.state.map;
    let markers=[];
    let stateMarkers = this.state.markers;
    //clear markers on map
    for (var i = 0; i < stateMarkers.length; i++) {
      stateMarkers[i].setMap(null);
    }
   
    let infoWindow = new window.google.maps.InfoWindow({map:map});
    
    this.state.filteredRestaurants.forEach(function(resto){
      
      let latlong = {
        lat: resto.lat,
        lng: resto.lng
      };
      
      var marker = new window.google.maps.Marker({
        position: latlong,
        map: map,
        icon: restaurant_pin,
        hovericon: restaurant_pin_hover,
        outicon: restaurant_pin,
      });
      
      markers.push(marker);

      var content='<div id="infowindow"><h4>'+ resto.restaurantName +'</h4><p className="address">'+resto.address+'</p><p>&nbsp</p><a href="" data-toggle="modal" data-target=#'+resto.id+'>Show Details</a></div>';
        
      marker.addListener('click', function() {
        infoWindow.setPosition(latlong);
        infoWindow.setContent(content);
        infoWindow.open(map,marker);
      });
    });
    
    this.setState({
      markers:  markers,
    });

  }

/*google places / GP */
  getGooglePlaces = () => {
    let map = this.state.map;
    var request = {
      location: this.state.mapCenter,
      radius: '500',
      type: ['restaurant'],
    };

    var service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, this.placesCallback);
  }
  placesCallback = (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      this.setState({ nearbyRestaurants: results});
    }
  }

  handleGPinMap = () => {
    //console.log(this.state.nearbyRestaurants);
    this.setState({
      nearbyRestaurantsinMap:  this.filterGPBounds(),
    });
    //console.log(this.state.nearbyRestaurantsinMap);

    this.handlefilterGPRaiting();
  }
  filterGPBounds = () => {
    return this.state.nearbyRestaurants.filter((item) => {
      let lat = item.geometry.location.lat();
      let lng = item.geometry.location.lng();
      if((lat <= this.state.NE_lat && lat >= this.state.SW_lat)&&(lng <= this.state.NE_lng && lng >= this.state.SW_lng)){
         return item;
      }else{
        return null;
      }
    });
  }
  handlefilterGPRaiting =() => {
    this.setState({
      filteredNearbyRestaurants:  this.filterGPRaiting(),
    });
  }

  filterGPRaiting = () => {
    let min = this.state.minStar;
    let max = this.state.maxStar;

    return this.state.nearbyRestaurantsinMap.filter((item) => {
      
      var rating = item.rating;
      
      if(rating >= min && rating <= max){
        return item
      }else{
        return null;
      }
    });
  }
  setGPMarkers = () => {
    let map = this.state.map;
    let gpmarkers=[];
    let stategpMarkers = this.state.gpmarkers;
    //clear markers on map
    for (var i = 0; i < stategpMarkers.length; i++) {
      stategpMarkers[i].setMap(null);
    }
   
    let infoWindow = new window.google.maps.InfoWindow({map:map});
    this.state.filteredNearbyRestaurants.forEach(function(resto){

      let latlong = {
        lat: resto.geometry.location.lat(),
        lng: resto.geometry.location.lng()
      };
      //alert(latlong.lat);
      
      var marker = new window.google.maps.Marker({
        position: latlong,
        map: map,
        icon: restaurant_pin,
        hovericon: restaurant_pin_hover,
        outicon: restaurant_pin,
      });
      gpmarkers.push(marker);

      var content='<div id="infowindow"><h4>'+ resto.name +'</h4><p className="address">'+resto.vicinity+'</p><p>&nbsp</p><a href="" data-toggle="modal" data-target=#'+resto.place_id+'>Show Details</a></div>';

      marker.addListener('click', function() {
        infoWindow.setPosition(latlong);
        infoWindow.setContent(content);
        infoWindow.open(map,marker);
      });
    });
    
    this.setState({
      gpmarkers:  gpmarkers,
    });

  }
 
/*add comment */


  saveComment(venue, ratings) {
    let newRating = ratings;     
   
    const updatedRestaurants = this.state.restaurants.map(resto => {
      if(resto !== venue) return resto;
      var joined = resto.ratings.concat(newRating);
      return {
          ...resto,
          ratings : joined
      };
    });
    this.setState({restaurants : updatedRestaurants});
    this.handlefilterRaiting();
  }


/*add new place */
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  saveVenue(newVenue) {
    newVenue.lat = this.state.newlatLng.lat();
    newVenue.lng = this.state.newlatLng.lng();
    newVenue.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 15);
    this.setState({ restaurants: [...this.state.restaurants, newVenue]});
    this.toggle();
    this.handleRestaurantsinMap();
  }
  
  handleDivEnter = (id) => {
    let thisMarker = this.state.markers[id];
     thisMarker.setIcon(thisMarker.hovericon);
  }
  handleDivLeave = (id) => {
    let thisMarker = this.state.markers[id];
     thisMarker.setIcon(thisMarker.outicon);
  }
  handleDivEnter_GP = (id) => {
    let thisMarker = this.state.gpmarkers[id];
     thisMarker.setIcon(thisMarker.hovericon);
  }
  handleDivLeave_GP = (id) => {
    let thisMarker = this.state.gpmarkers[id];
     thisMarker.setIcon(thisMarker.outicon);
  }
  
  render() {
    return (
      <div className="App">
      
        <Header />
        
        <div className="row">
          <div className="col-sm-8 mapDiv" ref="mapDiv">
           <Map 
            bounds={this.state.bounds}
           />
           <span className="badge badge-warning">To add a new restaurant right-click on its position on the map!</span>
          </div>
          <div className="col-sm-4">
            <Filters 
              minStar={this.state.minStar}
              maxStar={this.state.maxStar}
              filterStars={this.handleFilterStars}
            />
            <div  className="placesDiv">
              <Places 
                filteredRestaurants={this.state.filteredRestaurants}    
                saveComment={this.saveComment}  
                handleDivEnter={this.handleDivEnter}
                handleDivLeave={this.handleDivLeave}
              />
              <hr />
              <GooglePlaces 
                nearbyRestaurants={this.state.filteredNearbyRestaurants}    
                handleDivEnter_GP={this.handleDivEnter_GP}
                handleDivLeave_GP={this.handleDivLeave_GP}
              />
            </div>
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>Create new restaurant</ModalHeader>
              <ModalBody>
                <NewVenueForm showModal={this.state.showModal} toggle={this.toggle} saveVenue={this.saveVenue} newlatLng={this.state.newlatLng}/>
              </ModalBody>
              
            </Modal>

          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
