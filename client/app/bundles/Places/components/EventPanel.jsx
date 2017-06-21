import React from "react"
import PropTypes from "prop-types"
import {Panel, Accordion} from "react-bootstrap"

export default class EventPanel extends React.Component {

  dateToTime(dateString) {
    let a = null
    let amPm = "AM"

    if (typeof dateString === "number") {
      a = dateString
    }

    if (a > 12) {
      a = (a - 12).toString()
      amPm = "PM"
    }    return `${a} ${amPm}`
  }

  // May need to find a way to tie in place and event together in this panel
  eventPanel = (e) => {
    const address = e.address1.replace(", USA", "")
    const headerString = (
      <div style={{fontSize: "12px"}}>
        <h4 className="place-title">{e.name}</h4>
        <p className="event-hours">{`${e.dow}: ${this.dateToTime(e.start_time)} - ${this.dateToTime(e.end_time)}`}</p>
        <p className="place-address">{address}</p>
      </div>
    )
    const panel = (
      <Panel key={e.id}
             id={`panel-${e.id}`}
             header={headerString}
             eventKey={e.id.toString()}
             onSelect={this.handleSelect}>
             <p><strong>{e.dow} Specials</strong></p>
             {Object.entries(e.menu).sort().map(([key,value]) => {
               return <p className="menu-item" key={key}>{key}: ${value}</p>
             })}
      </Panel>
    )
    return panel
  }



  eventList = () => {
    let allEvents = this.props.showEvents || this.props.allEvents
    let list = allEvents.map(event => {
      return this.eventPanel(event)
    })
    return list
  }

  handleSelect = (e) => {
    this.props.onSelectChange(e)
  }

  render() {
    let defaultActive = this.props.selected ? this.props.selected : ""

    return (
      <Accordion activeKey={defaultActive} onSelect={this.handleSelect}>
        {this.eventList()}
      </Accordion>
    )
  }
}

// Need to look into why there are two types
EventPanel.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  allEvents: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  selected: PropTypes.any.isRequired,
  onSelectChange: PropTypes.func,
  showEvents: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ])
}
