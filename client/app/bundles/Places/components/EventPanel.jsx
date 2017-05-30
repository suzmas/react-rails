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

  // May need to find a way to tie in place and event together in this panel
  placePanel = (e) => {
    const headerString = (
      <div style={{fontSize: "12px"}}>
        <h4>{e.name}</h4>
        <p>{`${e.dow}: ${this.dateToTime(e.start_time)} - ${this.dateToTime(e.end_time)}`}</p>
      </div>
    )
    console.log(e)
    const panel = (
      <Panel key={e.id}
             header={headerString}
             eventKey={e.id}>
             <p><strong>Specials</strong></p>
             {Object.entries(e.menu).map(([key,value]) => {
               return <p>{key}: ${value}</p>
             })}
      </Panel>
    )

    return panel
  }

  placeList = () => {
    // let places = (this.props.data.length) ? this.props.data : JSON.parse(this.props.all)
    let allEvents = []

    if (this.props.allEvents) {
      allEvents = this.props.allEvents
    } else {
      places.forEach(place => {
        place.events.forEach(event => {
          allEvents.push(event)
        })
      })
    }

    let list = allEvents.map(event => {
      return this.placePanel(event)
    })

    return list
  }

  // handleSelect = (e,k) => {
  //   this.props.onSelectChange(e);
  // }

  // handleExit = (e,k) => {
  //   console.log("exit")
  // }

  render() {
    return (
      <Accordion onSelect={this.handleSelect}>
        {this.placeList()}
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
