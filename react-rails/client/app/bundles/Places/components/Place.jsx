import React from 'react';
import PropTypes from 'prop-types';

import {Grid, Row, Col} from "react-bootstrap";
import NavBar from "./Navbar";
import PlaceMap from "./Map";
import PlacePanel from "./PlacePanel";
import EventPanel from "./EventPanel";

export default class Place extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBool = this.handleBool.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.handleData = this.handleData.bind(this);
        this.handleSelectedPanel = this.handleSelectedPanel.bind(this);
        this.state = { data: "", selectedPanel:"", loc: "", text: "", hasFood: false, hasDrink: false };
    }


    // Filters and changes data state
    handleChange(text) {
      this.setState({ text: text }, this.handleData);
    }

    // Data transfer is correct, but need to use this for Events page for real test
    handleBool(obj) {
      this.setState({ hasFood: obj.hasFood, hasDrink: obj.hasDrink }, this.handleData);
    }

    handleLocation(loc) {
      this.setState({ loc: loc.loc }, this.handleData);
    }

    handleSelectedPanel(id) {
      this.setState({selectedPanel: id})
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

      this.setState({ data: data });
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
          primaryColor={this.style.primaryColor}
          secondaryColor={this.style.secondaryColor}
          onLocationChange={this.handleLocation}/>
        <Grid>
        <Row>

          <Col md={4}>
            <PlacePanel all={this.props.all} data={this.state.data} onSelectChange={this.handleSelectedPanel} />
          </Col>

          <Col md={4}>
            <PlaceMap all={this.props.all}
                      data={this.state.data}
                      selected={this.state.selectedPanel}
                      style={{position: "fixed", maxWidth: "40vw", height: "93vh"}}/>
          </Col>

          <Col md={4}>
            <EventPanel all={this.props.all} data={this.state.data} onSelectChange={this.handleSelectedPanel} />
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
