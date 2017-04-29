import React, { PropTypes } from 'react';
import ReactBootstrap from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Panel, PanelGroup, Accordion} from 'react-bootstrap';


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

  eventsString = (events) => {
    // simple data to stick in panel for now
    let stringArray = events.map(event => {
      return (
      `${event.dow}: ${event.start_time}-${event.end_time}`
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
      <Accordion>
        {places.map(place => {
          return ( this.placePanel(place.place, place.events) )
        })}
      </Accordion>

    return list;
  }


  render() {
    return (
      <div>
        {this.placeList()}
      </div>
    )
  }
}
