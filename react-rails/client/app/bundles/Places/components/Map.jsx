import React, { PropTypes } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { latLngBounds } from "leaflet";

export default class PlaceMap extends React.Component {
    state = {
        lat: 32.7157,
        lng: -117.1611,
        zoom: 15,
    };

    placeMarker = () => {
        let places = this.props.data || JSON.parse(this.props.all);


        let list =
      places.map(place => {
          let zIndexOffset = 0;
          let iconUrl = 'http://www.clker.com/cliparts/c/9/m/4/B/d/google-maps-grey-marker-w-shadow-hi.png'
          if (this.props.selected === place.place.id) { zIndexOffset = 1000; iconUrl = 'http://www.myiconfinder.com/uploads/iconsets/56165014858e6dbadaf3ba00d782f125.png' }
          const position = [place.place.latitude, place.place.longitude];
          let icon = L.icon({iconUrl: iconUrl, iconSize: 40});
          return (
          <Marker key={place.place.id} position={position} zIndexOffset={zIndexOffset} icon={icon}>
            <Popup>
              <span>{place.place.name}</span>
            </Popup>
          </Marker>
          );
      });
        return list;
    }

    getCoords = () => {
        let places = (this.props.data.length) ? this.props.data : JSON.parse(this.props.all);

        const bounds = latLngBounds();

        places
      .map(place => { return [place.place.latitude, place.place.longitude]; })
      .map(data => { bounds.extend(data); });

      // control for error w/ identical LatLngBounds
        if (places.length === 1) {
          bounds._northEast.lat += .001;
        }

        return bounds;
    }

    render() {
        const bounds = this.getCoords();
        return (
      <Map bounds={bounds} style={this.props.style}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url='http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png' />
        {this.placeMarker()};
      </Map>
        );
    }
}
