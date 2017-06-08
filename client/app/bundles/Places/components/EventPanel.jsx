import React from "react"
import PropTypes from "prop-types"
import {Panel, Accordion} from "react-bootstrap"

export default class EventPanel extends React.Component {

  state = {
    active: false
  }

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

  handleSelect = (e) => {
    (!this.state.active) ?
      this.setState({active: true}, this.props.onSelectChange(e)) :
      this.setState({active: false}, this.props.onSelectChange(null))
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
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  allEvents: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  onSelectChange: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}
