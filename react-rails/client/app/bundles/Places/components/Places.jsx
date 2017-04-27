import React, { PropTypes } from 'react';
import ReactBootstrap from 'react-bootstrap'
import {Button} from 'react-bootstrap'

export default class Places extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
  }

  placeList = () => {
    let places = this.props.name;
    places = JSON.parse(places);
    console.log(places);
    for (let i = 0; i < places.length; i++ ) {
      console.log(places[i].name);
    }

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
      </div>
    );
  }
}
