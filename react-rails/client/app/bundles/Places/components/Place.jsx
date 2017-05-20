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
        this.handleBool = this.handleBool.bind(this);
        this.handlePosition = this.handlePosition.bind(this);
        this.handleData = this.handleData.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.state = { data: "", lat: "", lng: "", loc: "", text: "", hasFood: false, hasDrink: false };
    }


    // Filters and changes data state
    handleChange(text) {
      this.setState({text: text}, this.handleData);
    }

    // Data transfer is correct, but need to use this for Events page for real test
    handleBool(obj) {
      this.setState({hasFood: obj.hasFood, hasDrink: obj.hasDrink}, this.handleData);
    }

    handlePosition(pos) {
      this.setState({
        lat: pos.lat,
        lng: pos.lng
      })
    }

    handleLocation(loc) {
      this.setState({
        loc: loc.loc
      })
    }

    handleData() {
      let places = this.state.loc || JSON.parse(this.props.all);

      let data = places.filter(place => {
          return place.place.name.toLowerCase().includes(this.state.text.toLowerCase().trim());
      })

      if (this.state.hasFood) {
        data = data.filter(place => {
          return place.events.filter(event => { return event.has_food });
        })
      }

      if (this.state.hasDrink) {
        data = data.filter(place => {
          return place.events.filter(event => { return event.has_drink });
        })
      }

      this.setState({data: data});
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
          onBoolChange={this.handleBool}
          position={this.handlePosition}
          primaryColor={this.style.primaryColor}
          secondaryColor={this.style.secondaryColor}
          onLocationChange={this.handleLocation}/>
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
