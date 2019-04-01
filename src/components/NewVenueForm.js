import React, { Component } from 'react'
import { Form, FormGroup, Label, Input,  FormText, Button } from 'reactstrap';

const RESET_VALUES = {restaurantName: '', address: '', lat: null, lng:null, ratings:[{ stars: 3, comment: "" }] };

class NewVenueForm extends Component {
  constructor(props){
    super(props)
    this.state = {
        newVenue: Object.assign({}, RESET_VALUES),
        formValid: false,
    }
      
  }

  inputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState((prevState) => {
      prevState.newVenue[name] = value;
      return { newVenue: prevState.newVenue };
    });
    
    if(this.state.newVenue.restaurantName !== '' && this.state.newVenue.address !== ''){
      this.setState({ formValid: true });
    }
    if(this.state.newVenue.restaurantName === '' || this.state.newVenue.address === ''){
       this.setState({ formValid: false });
    }
      
  }
  setLocation = () => {
    this.setState((prevState) => {
      prevState.newVenue.lat = this.props.newlatLng.lat();
      prevState.newVenue.lng = this.props.newlatLng.lng();
      return { newVenue: prevState.newVenue };
    });
  }

  onSaveVenue(e) {
    e.preventDefault();
    this.props.saveVenue(this.state.newVenue);
    this.setState({
      newVenue: Object.assign({}, RESET_VALUES),
    });
    this.props.toggle();
  }
    
	render(){

    return (
      <Form>

        <h6>Location: <span className="badge badge-secondary">{this.props.newlatLng.lat()}</span> / <span className="badge badge-secondary">{this.props.newlatLng.lng()}</span></h6>
        <hr/>

        <FormGroup>
          <Label for="restaurantName">Restaurant Name</Label>
          <Input type="text" name="restaurantName" id="restaurantName" value={this.state.newVenue.restaurantName} onChange={(event) => this.inputChange(event)} innerRef={(input) => (this.projectNameRef = input)}/>
        </FormGroup>

        <FormGroup>
          <Label for="address">Restaurant Address</Label>
          <Input type="text" name="address" id="address" value={this.state.newVenue.address} onChange={(event) => this.inputChange(event)} innerRef={(input) => (this.projectNameRef = input)}/>
        </FormGroup>
        <FormText>* All fields are required</FormText>
        <hr/>

        <Button disabled={this.state.formValid === false} color="primary" onClick={this.onSaveVenue.bind(this)}>Add Restaurant</Button>{' '}
        <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
      </Form>
       
		)
  
	}
}

export default NewVenueForm;
