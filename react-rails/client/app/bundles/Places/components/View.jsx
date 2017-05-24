import React from "react"
import PropTypes from "prop-types"
import {Grid, Row, Col} from "react-bootstrap"
import NavBar from "./Navbar"
import PlaceMap from "./Map"
import PlacePanel from "./PlacePanel"
import EventPanel from "./EventPanel"

export default class View extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: "",
      allEvents: "",
      selectedPanel: "",
      loc: "",
      text: "",
      hasFood: false,
      hasDrink: false,
      activeHour: "",
      activeDay: "",
    }
  }

  // Filters and changes data state
  handleChange = (text) => {
    this.setState({ text: text }, this.handleData)
  }

  handleBool = (obj) => {
    this.setState({ hasFood: obj.hasFood, hasDrink: obj.hasDrink }, this.handleData)
  }

  handleLocation = (loc) => {
    this.setState({ loc: loc.loc }, this.handleData)
  }

  handleSelectedPanel = (id) => {
    this.setState({selectedPanel: id})
  }

  handleTimeChange = (time) => {
    this.setState({activeHour: time}, this.handleData)
  }

  handleDayChange = (day) => {
    this.setState({activeDay: day}, this.handleData)
  }

  handleViewChange = (view) => {
    this.props.onViewChange(view)
  }

  filterTime = (data) => {
    const hoursOfDay = []
    let events = []
    for (let i=0; i<25; i++) { hoursOfDay.push(i.toString()) }

    data = data.filter(place => {
      var e = place.events.filter(event => {
        // parse out hour ints
        let startTime = (/T(\w+):\w+/.exec(event.start_time))[1]
        if (startTime.startsWith("0")) {
          startTime = startTime.slice(1)
        }

        let endTime = (/T(\w+):\w+/.exec(event.end_time))[1]
        if (endTime.startsWith("0")) {
          endTime = endTime.slice(1)
        }

        // mk array of event active hours
        const hoursOfEvent = hoursOfDay.slice(hoursOfDay[startTime], hoursOfDay[endTime])

        let activeHour = this.state.activeHour !== "" ?
          this.state.activeHour.toString()
        : event.startTime

        let activeDay = this.state.activeDay !== "" ? this.state.activeDay : event.dow
        console.log(activeDay)


        return ((hoursOfEvent.includes((activeHour))) && (event.dow === activeDay))
      })

      events.push(e)
      return e.length > 0
    })

    // Collect all events that pass time filter
    let allEvents = []
    events.forEach(group => {
      group.forEach(event => {
        allEvents.push(event)
      })
    })

    return {data: data, allEvents: allEvents}
  }



  handleData = () => {
    let places = this.state.loc || JSON.parse(this.props.all)

    let data = places.filter(place => {
      return place.place.name.toLowerCase().includes(this.state.text.toLowerCase().trim())
    })

    let allEvents = []
    if (this.state.activeHour !== ("")) {
      let tmp = this.filterTime(data)
      data = tmp.data
      allEvents = tmp.allEvents
    } else {
      data.forEach(place => {
        place.events.forEach(event => {
          allEvents.push(event)
        })
      })
    }

    if (this.state.hasFood) {
      data = data.filter(place => {
        return place.events.filter(event => { return event.has_food })
      })

      allEvents = allEvents.filter(event => {
        return event.has_food
      })
    }

    if (this.state.hasDrink) {
      data = data.filter(place => {
        return place.events.filter(event => { return event.has_drink })
      })
      allEvents = allEvents.filter(event => {
        return event.has_drink
      })
    }

    this.setState({ data: data, allEvents: allEvents })
  }

  // TO DO:
  // possibly remove this and import file w/ style objects
  style = {
    primaryColor: "#51bdcb",
    secondaryColor: "#FFFFFF"
  }


  render() {
    let panel = null
    this.props.view == "place" ?
      panel = <PlacePanel
        all={this.props.all}
        data={this.state.data}
        onSelectChange={this.handleSelectedPanel} />
    : panel = <EventPanel
        all={this.props.all}
        data={this.state.data}
        allEvents={this.state.allEvents}
        onSelectChange={this.handleSelectedPanel} />
    return (
      <div>
        <NavBar
          onSearchChange={this.handleChange}
          onBoolChange={this.handleBool}
          primaryColor={this.style.primaryColor}
          secondaryColor={this.style.secondaryColor}
          onLocationChange={this.handleLocation}
          onTimeChange={this.handleTimeChange}
          onDayChange={this.handleDayChange}
          onViewChange={this.handleViewChange}/>
        <Grid>
        <Row>

          <Col md={6}>
            {panel}
          </Col>

          <Col md={6}>
            <PlaceMap all={this.props.all}
                      data={this.state.data}
                      selected={this.state.selectedPanel}
                      style={{position: "fixed", maxWidth: "40vw", height: "93vh"}}/>
          </Col>

        </Row>
        </Grid>
      </div>
    )
  }
}

View.propTypes = {
  onViewChange: PropTypes.func,
  hoursOfDay: PropTypes.string,
  all: PropTypes.string.isRequired,
  view: PropTypes.string,
}
