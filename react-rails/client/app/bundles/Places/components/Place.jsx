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
    let stringArray = events.map(event => {
      console.log(event.dow);
      return (
      `${event.dow}: ${event.start_time}-${event.end_time}`
    )});

    return stringArray.toString();
  }

  placePanel = (place, events) => {
    console.log(place.name);
    let panel = (
      <Panel header={place.name} eventKey="1">
        {this.eventsString(events)}
      </Panel>)

    return panel
  }

  placeList = () => {
    let places = this.props.all;
    places = JSON.parse(places);

    /* map places to dom elements; add keys so React knows which to change
     */
    places = places.map(place => {
      return (
        <div>
          {this.placePanel(place.place, place.events)}
        </div>
      )
    });

    return (<ul>{places}</ul>)
  }



  render() {
    return (
      <div>
        {this.placeList()}
      </div>
    );
  }
}
