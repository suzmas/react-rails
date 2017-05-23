import React from "react"
import PropTypes from "prop-types"
import {Panel, Accordion} from "react-bootstrap"

export default class PlacePanel extends React.Component {

  dateToTime(dateString) {
    console.log(dateString);
    let time = new Date(dateString).getHours();
    console.log(new Date(dateString));
    console.log(time);
    let amPm = "AM";

    if (time > 12) {
      time = parseInt(time) - 12;
      amPm = "PM"
    }

    return `${time}:00 ${amPm}`;
  }

  eventString = (events) => {
    let stringArray = events.map(event => {
      const start_time = this.dateToTime(event.start_time)
      const end_time = this.dateToTime(event.end_time)

      return (
        `${event.dow}: ${start_time}-${end_time}`
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
    let places = (this.props.data.length) ? this.props.data : JSON.parse(this.props.all)

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
