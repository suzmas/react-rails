import React, { PropTypes } from 'react';

import ReactBootstrap from 'react-bootstrap';
import {Panel, PanelGroup, Accordion} from 'react-bootstrap';

import NavBar from './navbar';
import Map from './Map';


export default class Place extends React.Component {
  static propTypes = {
    all: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  /*
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
  }


  dateToTime(dateString) {
      let a;
      if (typeof dateString === 'string') {
          a = /T(\w+:\w+)/.exec(dateString);
      }
      if (a[1].startsWith('0')) { a[1] = a[1].slice(1) }

      return a[1];
  }

  // VIEW STUFF

  eventsString = (events) => {
    // simple data to stick in panel for now
    let stringArray = events.map(event => {
      const start_time = this.dateToTime(event.start_time);
      const end_time = this.dateToTime(event.end_time);

      return (
      `${event.dow}: ${start_time}-${end_time}`
    )});

    return stringArray.toString()
  }

  placePanel = (place, events) => {
    let panel = (
      <Panel key={place.id} header={place.name} eventKey={place.id}>
        {this.eventsString(events)}
      </Panel>);

    return panel
  }

  placeList = () => {
    let places = this.props.all;
    places = JSON.parse(places);

    let list =
      <Accordion style={{maxWidth: "500px"}}>
        {places.map(place => {
          return ( this.placePanel(place.place, place.events) )
        })}
      </Accordion>

    return list;
  }


  render() {
    return (
      <div>
        <NavBar />
        {this.placeList()}
        <Map />
      </div>
    )
  }
}
