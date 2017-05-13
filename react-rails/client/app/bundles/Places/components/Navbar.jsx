import React, { PropTypes } from "react";

import {Navbar, FormGroup, FormControl, ControlLabel, Button, InputGroup} from "react-bootstrap";


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

    timeSelect = () => {
      let timeVals =
        ([1,2,3,4,5,6,7,8,9,10,11,12])
        .map(i => {
            return (
              <option value={i} key={`${i}:00`}>
                {`${i}:00`}
              </option>
            )
          })
      return timeVals;
    }

    placeTime = () => {
      return (
        <FormGroup>
          <ControlLabel>CLOCK HERE</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="now">Now</option>
            { this.timeSelect() }
          </FormControl>
          <FormControl componentClass="select" placeholder="select">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </FormControl>
        </FormGroup>
      )
    }

    navbarInstance() {
        return (
    <Navbar fixedTop style={{backgroundColor: this.props.primaryColor}}>
      <Navbar.Header>
        <Navbar.Brand>
          <a style={{color: this.props.secondaryColor}} href="#">ANFERNE</a>
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
