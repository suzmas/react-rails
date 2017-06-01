import React from "react"
import PropTypes from "prop-types"
import {Panel, Accordion} from "react-bootstrap"

export default class EventPanel extends React.Component {

  dateToTime(dateString) {
    let a = null
    let amPm = "AM"

    if (typeof dateString === "string") {
      a = /T(\w+):\w+/.exec(dateString)
    }

    if (a[1].startsWith("0")) {
      a[1] = a[1].slice(1)
    }

    if (parseInt(a[1]) > 12) {
      a[1] = (parseInt(a[1]) - 12).toString()
      amPm = "PM"
    }
    return `${a[1]}:00 ${amPm}`
  }

  // May need to find a way to tie in place and event together in this panel
  eventPanel = (e) => {
    const headerString = (
      <div style={{fontSize: "12px"}}>
        <h4>{e.name}</h4>
        <p>{`${e.dow}: ${this.dateToTime(e.start_time)} - ${this.dateToTime(e.end_time)}`}</p>
      </div>
    )
    const panel = (
      <Panel key={e.id}
             header={headerString}
             eventKey={e.id}>
             <p><strong>Specials</strong></p>
             {Object.entries(e.menu).map(([key,value]) => {
               return <p key={key}>{key}: ${value}</p>
             })}
      </Panel>
    )
    return panel
  }

  eventList = () => {
    let list = this.props.allEvents.map(event => {
      return this.eventPanel(event)
    })
    return list
  }

  render() {
    return (
      <Accordion onSelect={this.handleSelect}>
        {this.eventList()}
      </Accordion>
    )
  }
}

// Need to look into why there are two types
EventPanel.propTypes = {
  all: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  allEvents: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ])
}
