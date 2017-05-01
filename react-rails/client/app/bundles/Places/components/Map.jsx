import React, { PropTypes } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import {latLngBounds} from 'leaflet';

export default class SimpleExample extends React.Component {
  state = {
    lat: 32.7157,
    lng: -117.1611,
    zoom: 15,
  };

  placeMarker = () => {
    let places = this.props.all;
    places = JSON.parse(places);

    let list =
      places.map(place => {
        var position = [place.place.latitude, place.place.longitude];
        return (
          <Marker key={place.place.id} position={position}>
            <Popup>
              <span>Yes</span>
            </Popup>
          </Marker>
        )
      })

    return list
  }

  makeCoords = () => {
    let places = this.props.all;
    places = JSON.parse(places);
    const bounds = latLngBounds([this.state.lat, this.state.lng]);

    places
      .map(place => { [place.place.latitude, place.place.longitude] })
      .map(data => { bounds.extend(data) })

    return bounds
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    // const bounds = this.makeCoords();
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url='http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png' />
        {this.placeMarker()};
      </Map>
    );
  }
}
