import React, { PropTypes } from 'react';
import ReactBootstrap from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Panel, PanelGroup, Accordion} from 'react-bootstrap';


export default class Place extends React.Component {
  static propTypes = {
    places: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
  }


  placePanel = (place) => {
    return <p>{place}</p>
  }

  placeList = () => {
    let places = this.props.places;
    places = JSON.parse(places);
    console.log(places);

    // map places to dom elements
    places = places.map(function(place) {
      return <li key={place.id}>{(place).name}</li>
    });

    return (<ul>{places}</ul>)
  }



  render() {
    return (
      <div>
        {this.placeList()}
        {this.placePanel("hey")}
      </div>
    );
  }
}
