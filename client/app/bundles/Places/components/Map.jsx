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
    let places = (this.props.view === "place") ?
      this.props.data.map(place => {return place.place}) :
      (this.props.showEvents || this.props.allEvents)

    if (places.length < 1) return

    let list = places.map(place => {

      let iconUrl = "assets/inactive.png"
      const position = [place.latitude, place.longitude]
      const icon = L.icon({iconUrl: iconUrl, iconSize: 40})
      const address = place.address1.replace(", USA", "")
      const url = `https://www.google.com/maps/dir//${place.latitude},${place.longitude}`
      const popup =  <Popup><div><span>{place.name}</span>
                      <br /><span><a href={url}>{address}</a></span></div>
                     </Popup>

      if (this.props.selected === place.id) {
        icon.options.iconSize = 45
        return (
          <ActiveMarker position={position} key={place.id}
            zIndexOffset={100}
            icon={icon}>
            {popup}
          </ActiveMarker>
        )
      } else {
        return (
          <Marker key={place.id}
            position={position}
            icon={icon}>
            {popup}
          </Marker>
        )}
    })
    return list
  }

  getCoords = () => {
    let places = (this.props.view === "place") ?
      this.props.data.map(place => {return place.place}) :
      (this.props.showEvents || this.props.allEvents)

    const bounds = latLngBounds()

    if (places.length > 0) {
      places
        .map(place => { return [place.latitude, place.longitude] })
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
          url='http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png' attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>' />
          {this.placeMarker()}
          {this.openPopup}
      </Map>
    )
  }
}

// Create your own class, extending from the Marker class.
class ActiveMarker extends Marker {
	// "Hijack" the component lifecycle.
  componentDidMount() {
    // Call the Marker class componentDidMount (to make sure everything behaves as normal)
    super.componentDidMount()

    // Access the marker element and open the popup.
    this.leafletElement.openPopup()
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
  ]),
  view: PropTypes.string,
  allEvents: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
}
