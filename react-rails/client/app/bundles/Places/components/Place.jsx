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

  logIt = (it) => {
    console.log(it);
    it = it.name;
    let bler = `${it} is this`;
    return bler;
  }

  placePanel = (place) => {
    let panel = (<Panel header= {place.name} eventKey="1">
      Events and stuff
      </Panel>)

    return panel
  }

  placeList = () => {
    let places = this.props.all;
    places = JSON.parse(places);
    console.log("Here are the locations");
    console.log(places);

    /* map places to dom elements; add keys so React knows which to change
     * places = places.map(function(place) {
     *  return {this.placePanel(place)}
     * });
     */
    places = places.map(place => {
      console.log(place.events);
      console.log(this.logIt(place.place))
      return (
        <div>
          <p key={place.place.id}>{place.place.name}</p>
          {this.placePanel(place.place)}
          <p key={place.place.name}>{place.events[0].dow}</p>
        </div>
      )
    });

    return (<ul>{places}</ul>)
  }



  render() {
    return (
      <div>
        {this.placeList()}
        {this.placePanel({name: "Suzan", address1: "NO"})}
      </div>
    );
  }
}
