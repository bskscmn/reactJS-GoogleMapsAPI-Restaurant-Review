import React, { Component } from 'react';

class Filters extends Component {

    render() {
        
        return (
            <div className="filtersDiv row">

                <div className="col-sm-1">Min: </div>
                <div className="col-sm-4 text-center">
                    <input type="range" name="minStar" min="1" max="5" value={this.props.minStar} step="1" onChange={this.props.filterStars}/> 
                    <span className="badge badge-warning">{this.props.minStar}</span> 
                </div>
                <div className="col-sm-1">
                </div>
                <div className="col-sm-1">Max: </div>
                <div className="col-sm-4 text-center">
                    <input type="range" name="maxStar" min="1" max="5" value={this.props.maxStar} step="1" onChange={this.props.filterStars}/>
                    <span className="badge badge-warning">{this.props.maxStar}</span>
                </div>
            </div>
        );
    }
}

export default Filters;