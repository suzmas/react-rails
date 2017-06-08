import React from "react"
import PropTypes from "prop-types"
import {Panel, Accordion} from "react-bootstrap"

export default class PlacePanel extends React.Component {

  state = {
    active: false
  }

  formatTime(hour) {
    let amPm = hour < 13 ? "AM" : "PM"
    if (hour > 12) hour = hour - 12
    return `${hour} ${amPm}`
  }

  eventString = (events) => {
    let stringArray = events.map((event, i) => {
      const start_time = this.formatTime(event.start_time)
      let end_time = this.formatTime(event.end_time) + ","
      if (i === events.length-1) { end_time = end_time.replace(",","") }
      return (
        <p key={event.id} className="event-string">
          <b>{event.dow}</b> : {start_time} - {end_time}&nbsp;
        </p>
      )
    })

    return stringArray
  }

  placePanel = (place, events) => {
    place.address1 = place.address1.replace(", USA", "")
    const header = (
      <div>
        <h4 className="place-title">{place.name}</h4>
        <p className="place-neighborhood">{place.neighborhood}</p>
        <p className="place-address">{place.address1}</p>
      </div>)
    return (
      <Panel key={place.id}
             header={header}
             eventKey={place.id}>
        {this.eventString(events)}
      </Panel>
    )}

  placeList = () => {
    const places = this.props.data
    let list = places.map(place => {
      return this.placePanel(place.place, place.events)
    })
    return list
  }

  handleSelect = (e) => {
    (!this.state.active) ?
      this.setState({active: true}, this.props.onSelectChange(e)) :
      this.setState({active: false}, this.props.onSelectChange(null))
  }

  render() {
    return (
      <Accordion onSelect={this.handleSelect}>
        {this.placeList()}
      </Accordion>
    )
  }
}

PlacePanel.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired
  ]),
  onSelectChange: PropTypes.func
}
