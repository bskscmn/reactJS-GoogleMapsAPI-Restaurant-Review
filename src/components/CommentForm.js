import React, { Component } from 'react'

const RESET_VALUES = {stars: 4, comment: ''};

class CommentForm extends Component {
    constructor(props){
        super(props)
        this.commentChange = this.commentChange.bind(this);
        this.state = {
            
            ratings: Object.assign({}, RESET_VALUES),
            
        }
        
    }

    onComment(e) {
        e.preventDefault();
        this.props.saveComment(this.props.venue, this.state.ratings);
        this.setState({
          ratings: Object.assign({}, RESET_VALUES),
          
        });
	}

    commentChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.name === 'stars' ? parseInt(target.value,10) : target.value;

        this.setState((prevState) => {
          prevState.ratings[name] = value;
          return { ratings: prevState.ratings };
        });
    }
    
	render(){

		return (
			<div className="commentForm">
              
                <form>
                
                <textarea name="comment" value={this.state.ratings.comment} onChange={(event) => this.commentChange(event)} className="col-sm-12" placeholder="Leave comment!"/>
                <div className="col-sm-4">
                    <span className="badge  badge-warning">{this.state.ratings.stars}</span> 
                    <input type="range" name="stars" min="1" max="5" value={this.state.ratings.stars} step="1" onChange={(event) => this.commentChange(event)}/>
                </div>
                <div className="pull-right">
                <input type="submit" value="Save" className="btn btn-sm btn-primary" onClick={this.onComment.bind(this)} />
                </div>
                </form>
            </div>
		)
	}
}

export default CommentForm;