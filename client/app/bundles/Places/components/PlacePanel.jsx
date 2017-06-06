import React from "react"
import PropTypes from "prop-types"
import {Panel, Accordion} from "react-bootstrap"

export default class PlacePanel extends React.Component {

  formatTime(hour) {
    let amPm = hour < 13 ? "AM" : "PM"
    if (hour > 12) hour = hour - 12
    return `${hour}:00 ${amPm}`
  }

  eventString = (events) => {
    let stringArray = events.map(event => {
      const start_time = this.formatTime(event.start_time)
      const end_time = this.formatTime(event.end_time)

      return (
        `${event.dow}: ${start_time} - ${end_time}`
      )
    })

    return stringArray.join(", ")
  }

  placePanel = (place, events) => {
    const header = (
      <div>
        <h4 className="place-title">{place.name}</h4>
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
    this.props.onSelectChange(e)
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
