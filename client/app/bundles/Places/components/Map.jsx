import React from "react"
import PropTypes from "prop-types"
import L from "leaflet"
import { Map, TileLayer, Marker, Popup } from "react-leaflet"
import { latLngBounds } from "leaflet"

export default class PlaceMap extends React.Component {
  state = {
    lat: 32.7157,
    lng: -117.1611,
    zoom: 15,
  }

  placeMarker = () => {
    let places = this.props.data
    let list = places.map(place => {
      let zIndexOffset = 0
      let iconUrl = "assets/inactive.png"

      if (this.props.selected === place.place.id) { zIndexOffset = 1000; iconUrl = "assets/active.png" }
      const position = [place.place.latitude, place.place.longitude]
      let icon = L.icon({iconUrl: iconUrl, iconSize: 35})

      return (
        <Marker key={place.place.id} position={position} zIndexOffset={zIndexOffset} icon={icon}>
          <Popup>
            <span>{place.place.name}</span>
          </Popup>
        </Marker>
      )
    })

    return list
  }

  getCoords = () => {
    let places = this.props.data

    const bounds = latLngBounds()

    if (places.length > 0) {
      places
        .map(place => { return [place.place.latitude, place.place.longitude] })
          .map(data => { bounds.extend(data) })
    } else {
      bounds.extend([[32.7057, -117.1611], [32.7557, -117.1611]])
    }

    // control for error w/ identical LatLngBounds
    if (places.length === 1) {
      bounds._northEast.lat += .001
    }

    return bounds
  }

  render() {
    const bounds = this.getCoords()
    return (
      <Map bounds={bounds}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url='http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png' />
        {this.placeMarker()}
      </Map>
    )
  }
}

PlaceMap.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  selected: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
}
