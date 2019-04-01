import React, { Component } from 'react';
import CommentForm from "./CommentForm";
import restoico from '../images/restoico.png';

class Places extends Component {


    render() {        
        let venues = this.props.filteredRestaurants.map((venue,i)=> {
            var streetviewSRC= "https://maps.googleapis.com/maps/api/streetview?size=400x400&location="+venue.lat+","+venue.lng+"&heading=400&key=AIzaSyB5dazcdcUhSUeZtgv1XTMijQAe9PpsMiM"
            var ratings = venue.ratings;
            var stars = 0;
            var total = 0;
            var average = 0;
            var modalDataID = "#"+venue.id;

            ratings.map(function(rating, j){
                stars = rating.stars;
                return total += stars; 
            })
            average = total/ratings.length;
            average = Math.round( average * 10 ) / 10;

            return (
                <div key={i}>
                    <div key={i} className="listDiv myplace row" data-toggle="modal" data-target={modalDataID} onMouseEnter={()=>this.props.handleDivEnter(i)} onMouseLeave={()=>this.props.handleDivLeave(i)}>
                        <div className="col-md-8">
                            <h4>{venue.restaurantName}</h4>
                            <p className="address">{venue.address}</p>
                            <p>{average} <i className="fa fa-star" aria-hidden="true"></i></p>
                        </div>
                        <div className="col-md-4">
                            <img className="rounded-circle" width="100px" height="100px" src={restoico} alt="VenuePhoto"/>
                        </div>
                       
                    </div> 

                    <div id={venue.id} className="modal fade" role="dialog" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                    
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{venue.restaurantName}</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <p className="address">{venue.address}</p>
                                <p  className="location">{venue.lat} - {venue.lng}</p> 
                                
                                <div className="listDiv">
                                    <p>{average} <i className="fa fa-star" aria-hidden="true"></i></p>
                                </div>
                                <img width='100%' height='350' src={streetviewSRC} alt="StreetViewImage"/>
                                {ratings.map(function(rating, k){
                                    if(rating.comment!==""){
                                        return (
                                            <div  key={k}>
                                                <div className="listDiv">
                                                <p>{rating.stars} <i className="fa fa-star" aria-hidden="true"></i>
                                                <br/>{rating.comment}</p>
                                                </div>
                                            </div>
                                        )
                                    }else{
                                        return (
                                            <div  key={k} className="listDiv">
                                                <p>{rating.stars} <i className="fa fa-star" aria-hidden="true"></i></p>
                                            </div>
                                        )
                                    }
                                })}
                                
                             
                                <CommentForm venue={venue} saveComment={this.props.saveComment}/>
                                
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

export default Places;

