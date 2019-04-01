import React, { Component } from 'react';
import axios from 'axios';

class PlaceDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: []
        };
    }
    componentDidMount() {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "https://maps.googleapis.com/maps/api/place/details/json?reference="+this.props.id+"&key=GoogleApiKeyHere";
            
        axios.get(proxyurl + url)
        .then(res => {
            const reviews = res.data.result.reviews;
            this.setState({ reviews });
        })
    }
    render() { 
        let reviews = this.state.reviews.map((review,i)=> {
            let rating = review.rating;
            let comment = review.text;
            return (
                <div  key={i}>
                    <div className="listDiv">
                    <p>{rating} <i className="fa fa-star" aria-hidden="true"></i>
                    <br/>{comment}</p>
                    </div>
                </div>
            );
        });
        
        return (
            <div>{reviews}</div>
        );
        
       
    }
}

export default PlaceDetails;

