import React, { PropTypes } from "react";

import {Navbar, FormGroup, FormControl, Button, InputGroup} from "react-bootstrap";


export default class NavBar extends React.Component {
    constructor(props, _railsContext) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handlePosition = this.handlePosition.bind(this);
    }

    handleChange(e) {
        this.props.onSearchChange(e.target.value);
    }

    handlePosition() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.props.position({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      );
    }

    placeKeyword = () => {
      return (
        <FormGroup>
          <FormControl type="text" placeholder="Search" onChange={this.handleChange}/>
        </FormGroup>
      )
    }

    placeLocation = () => {
      return (
        <FormGroup>
          <InputGroup>
            <FormControl type="text" placeholder="Enter Location"/>
            <InputGroup.Button>
              <Button onClick={this.handlePosition}><i className="fa fa-map-marker" aria-hidden="true"></i></Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      )
    }

    createOption = (index) => {
      return (
        <option value={index} key={`${index}:00`}>
          {`${index}:00 - ${index + 1}:00`}
        </option>
      )
    }

    createRange = () => {
      let range = [...Array(24).keys()];
      let options = range.map(i => {
        return this.createOption(i);
      })

      return options
    }

    placeTime = () => {
      return (
        <FormGroup>
          <FormControl componentClass="select" placeholder="select">
            <option value="now">Now</option>
            <option value="all">All Times</option>
            { this.createRange() }
          </FormControl>
        </FormGroup>
      )
    }

    navbarInstance() {
        return (
    <Navbar fixedTop style={{backgroundColor: this.props.primaryColor}}>
      <Navbar.Header>
        <Navbar.Brand>
          <a style={{color: this.props.secondaryColor}} href="#">COOL BRAND HERE</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Navbar.Form pullLeft>
          { this.placeKeyword() }
          { this.placeLocation() }
          { this.placeTime() }
          <Button style={{color: this.props.primaryColor}}><i className="fa fa-cutlery" aria-hidden="true"></i></Button>
          <Button style={{color: this.props.primaryColor}}><i className="fa fa-beer" aria-hidden="true"></i></Button>
          {" "}
          <Button type="submit">Submit</Button>
        </Navbar.Form>
      </Navbar.Collapse>
    </Navbar>
        );}

    render() {
        return (
      <div>
        {this.navbarInstance()}
      </div>
        );
    }

}
