import React from "react"
import PropTypes from "prop-types"
import {Panel, Accordion} from "react-bootstrap"

export default class PlacePanel extends React.Component {

  dateToTime(dateString) {
    let a = null
    let amPm = "AM"

    if (typeof dateString === "number") {
      a = dateString
    }

    if (a > 12) {
      a = (a - 12).toString()
      amPm = "PM"
    }    return `${a}:00 ${amPm}`
  }

  eventString = (events) => {
    let stringArray = events.map(event => {
      const start_time = this.dateToTime(event.start_time)
      const end_time = this.dateToTime(event.end_time)

      return (
        `${event.dow}: ${start_time} - ${end_time}`
      )
    })

    return stringArray.join(", ")
  }

  placePanel = (place, events) => {
    const headerString = (
      <div style={{fontSize: "12px"}}>
        <h4>{place.name}</h4>
        <p>{place.address1}</p>
      </div>
    )

    const panel = (
      <Panel key={place.id}
             header={headerString}
             eventKey={place.id}>
        {this.eventString(events)}
      </Panel>
    )

    return panel
  }

  placeList = () => {
    let places
    if (this.props.data === "") {
      places = JSON.parse(this.props.all)
    } else if (this.props.data.length) {
      places= this.props.data
    } else {
      places = []
    }

    let list = places.map(place => {
      return this.placePanel(place.place, place.events)
    })

    return list
  }

  // Had param(k)
  handleSelect = (e) => {
    this.props.onSelectChange(e)
  }

  // Had params(e, k)
  handleExit = () => {
    // console.log("exit")
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
  all: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  onSelectChange: PropTypes.func
}
