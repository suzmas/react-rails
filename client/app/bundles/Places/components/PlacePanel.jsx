import React from "react"
import PropTypes from "prop-types"
import {Panel, Accordion} from "react-bootstrap"

export default class PlacePanel extends React.Component {

  constructor(props) {
    super(props)
    this.showEvents = this.showEvents.bind(this)
  }

  formatTime(hour) {
    let amPm = hour < 13 ? "AM" : "PM"
    if (hour > 12) hour = hour - 12
    return `${hour} ${amPm}`
  }

  eventString = (events) => {
    let stringArray = events.map((event, i) => {
      const _onClick = () => {
        this.props.panelEventId(event.id)
      }
      const start_time = this.formatTime(event.start_time)
      let end_time = this.formatTime(event.end_time) + ","
      if (i === events.length-1) { end_time = end_time.replace(",","") }
      return (
        <p key={event.id} className="event-string" onClick={_onClick}>
          <a><b>{event.dow}</b>:</a> {start_time} - {end_time}&nbsp;
        </p>
      )
    })

    return stringArray
  }

  placePanel = (place, events) => {
    let address = place.address1.replace(", USA", "")
    const header = (
      <div>
        <h4 className="place-title">{place.name}</h4>
        <p className="place-neighborhood">{place.neighborhood}</p>
        <p className="place-address">{address}</p>
      </div>)
    return (
      <Panel key={place.id}
             id={`panel-${place.id}`}
             header={header}
             eventKey={place.id}
             onSelect={this.handleSelect}>
        {this.eventString(events)}
        <a onClick={this.showEvents} className="show-events event-string">All '{place.name}' Events <i className="fa fa-angle-double-right" aria-hidden="true"></i></a>
      </Panel>
    )}

  placeList = () => {
    const places = this.props.data
    let list = places.map(place => {
      return this.placePanel(place.place, place.events)
    })
    return list
  }

  showEvents() {
    this.props.panelId(this.props.selected)
  }

  handleSelect = (e) => {
    this.props.onSelectChange(e)
  }

  render() {
    let defaultActive = this.props.selected ? this.props.selected : ""
    let placeCount = this.props.data.length

    let panels = placeCount > 0 ?
      <Accordion onSelect={this.handleSelect} activeKey={defaultActive}>
        {this.placeList()}
      </Accordion> :
      <p>There are no matching places</p>

    return (
      <div>
        {panels}
      </div>
    )
  }
}

PlacePanel.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired
  ]),
  selected: PropTypes.any.isRequired,
  onSelectChange: PropTypes.func,
  panelEventId: PropTypes.func,
  panelId: PropTypes.func
}
