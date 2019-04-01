import React, { Component } from 'react';
import PlaceDetails  from './PlaceDetails';
import restoico from '../images/restoico.png';

class GooglePlaces extends Component {
    
    render() {        
        let venues = this.props.nearbyRestaurants.map((venue,i)=> {
            let lat = venue.geometry.location.lat();
            let lng = venue.geometry.location.lng();
            var streetviewSRC= "https://maps.googleapis.com/maps/api/streetview?size=400x400&location="+lat+","+lng+"&heading=400&key=GoogleApiKeyHere"
            
            let photoUrl =  typeof venue.photos !== 'undefined' 
            ? venue.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
            : restoico ;
            var key = "gP"+i;
            var modalDataID = "#"+venue.place_id;

          
            return (
                <div key={key}>
                    <div key={key} className="listDiv row" data-toggle="modal" data-target={modalDataID} onMouseEnter={()=>this.props.handleDivEnter_GP(i)} onMouseLeave={()=>this.props.handleDivLeave_GP(i)}>
                        <div className="col-md-8">
                            <h4>{venue.name}</h4>
                            <p className="address">{venue.vicinity}</p>
                            <p>{venue.rating} <i className="fa fa-star" aria-hidden="true"></i></p>
                        </div>
                        <div className="col-md-4">
                            <img className="rounded-circle" width="100px" height="100px" src={photoUrl} alt="VenuePhoto"/>
                        </div>
                    </div>

                    <div id={venue.place_id} className="modal fade" role="dialog" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                    
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{venue.name}</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                
                            </div>
                            <div className="modal-body">
                                <p className="address">{venue.vicinity}</p>
                                <p className="location">{lat}, {lng}</p>
                                    
                                <div className="listDiv">
                                    <p>{venue.rating} <i className="fa fa-star" aria-hidden="true"></i></p>
                                </div>
                                
                                <img width='100%' height='350' src={streetviewSRC} alt="StreetViewImage"/>
                                <PlaceDetails id={venue.place_id}></PlaceDetails>
                             </div>
                          
                        </div>
                    
                      </div>
                    </div>
                </div>
            );
        });
        
        return (
            <div>{venues}</div>
        );
    }
}

export default GooglePlaces;

