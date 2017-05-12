import React from 'react';
import PropTypes from 'prop-types';

import {Grid, Row, Col} from "react-bootstrap";
import NavBar from "./Navbar";
import PlaceMap from "./Map";
import Item from "./Panel";

export default class Place extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handlePosition = this.handlePosition.bind(this);
        this.state = {data: "", lat: "", lng: ""};
    }


    // Filters and changes data state
    handleChange(text) {
      let places = this.props.all;
      places = JSON.parse(places);

      let data = places
      .filter(place => {
          return place.place.name.toLowerCase().includes(text.toLowerCase().trim());
      });
      this.setState({data: data});
    }

    handlePosition(pos) {
      this.setState({
        lat: pos.lat,
        lng: pos.lng
      })
    }


    // TO DO:
    // possibly remove this and import file w/ style objects
    style = {
      primaryColor: "#2D767F",
      secondaryColor: "#FFFFFF"
    }


    render() {
        return (
      <div>
        <NavBar
          onSearchChange={this.handleChange}
          position={this.handlePosition}
          primaryColor={this.style.primaryColor}
          secondaryColor={this.style.secondaryColor} />
        <Grid>
        <Row>

          <Col md={6}>
            <Item all={this.props.all} data={this.state.data} />
          </Col>

          <Col md={6}>
            <PlaceMap all={this.props.all}
                      data={this.state.data}
                      style={{position: "fixed", maxWidth: "40vw", height: "93vh"}}/>
          </Col>

        </Row>
        </Grid>
      </div>
        );
    }
}

Place.propTypes = {
    all: PropTypes.string.isRequired, // this is passed from the Rails view
};
