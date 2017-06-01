import React from "react"
import PropTypes from "prop-types"
import {Grid, Row, Col, Clearfix, Button} from "react-bootstrap"
import NavBar from "./Navbar"
import PlaceMap from "./Map"
import PlacePanel from "./PlacePanel"
import EventPanel from "./EventPanel"

export default class View extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDay: "",
      activeHour: "",
      allEvents: "",
      changed: false,
      data: "",
      hasDrink: false,
      hasFood: false,
      length: 0,
      loc: "",
      next: false,
      page: 0,
      prev: false,
      selectedPanel: "",
      text: "",
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({changed: true, page: 0, text: ""}, this.handleData)
    }
  }

  componentDidMount() {
    this.handleData()
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
        : startTime

        let activeDay = this.state.activeDay !== "" ? this.state.activeDay : event.dow


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

  filterKeyword = (all) => {
    if (this.props.view === "place"){
      let data = all.data.filter(place => {
        return place.place.name.toLowerCase().includes(this.state.text.toLowerCase().trim())
      })
      return {data: data, allEvents: all.allEvents}
    }
    else {
      let allEvents = all.allEvents.filter(event => {
        return event.name.toLowerCase().includes(this.state.text.toLowerCase().trim())
      })
      return {data: all.data, allEvents: allEvents}
    }
  }

  filterBool = (all, type) => {
    let data = all.data.filter(place => {
      return place.events.filter(event => {
        return (type === "food") ? event.has_food : event.has_drink
      }).length > 0
    })

    let allEvents = all.allEvents.filter(event => {
      return (type === "food") ? event.has_food : event.has_drink
    })

    return {data: data, allEvents: allEvents}
  }



  handleData = () => {
    let places = this.state.loc || JSON.parse(this.props.all)

    if (!places.length) {
      this.setState({data: [], allEvents: [], length: 0}, this.setButtons)
      this.setState({changed: false})
      return
    }

    let tmp = {data: places, allEvents: null}

    //Filter by time
    tmp = this.filterTime(tmp.data)

    //Filter by keyword
    tmp = this.filterKeyword(tmp)

    //Filter by food
    if (this.state.hasFood) {
      tmp = this.filterBool(tmp, "food")
    }

    //Filter by drink
    if (this.state.hasDrink) {
      tmp = this.filterBool(tmp, "drink")
    }

    //For pagination
    const length = (this.props.view === "place") ? tmp.data.length : tmp.allEvents.length
    let start = this.state.page * 5
    let end = this.state.page * 5 + 5
    tmp.data = tmp.data.slice(start, end)
    tmp.allEvents = tmp.allEvents.slice(start, end)

    //Checks to see if page changed, instead of filters changing
    if (!this.state.changed) {
      this.setState({page: 0, prev: true, next: false, length: length}, function() {
        start = 0
        end = start + 5
        tmp.data = tmp.data.slice(start, end)
        tmp.allEvents = tmp.allEvents.slice(start, end)
        this.setState({data: tmp.data, allEvents: tmp.allEvents}, this.setButtons)
        return
      })
    }

    this.setState({data: tmp.data, allEvents: tmp.allEvents, length: length}, this.setButtons)
    this.setState({changed: false})
  }

  // TO DO:
  // possibly remove this and import file w/ style objects
  style = {
    primaryColor: "#51bdcb",
    secondaryColor: "#FFFFFF"
  }

  setPage = (str) => {
    if (str === "prev") {
      this.setState({page: this.state.page - 1, changed: true}, this.handleData)
    } else {
      this.setState({page: this.state.page + 1, changed: true}, this.handleData)
    }
  }

  setButtons() {
    if (this.state.page === 0) {
      this.setState({prev: true})
    } else {
      this.setState({prev: false})
    }

    if ((this.state.page + 1) * 5 >= this.state.length) {
      this.setState({next: true})
    } else {
      this.setState({next: false})
    }
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

          <Col sm={6} md={6}>
            {panel}
            <Button id="prev-btn" onClick={() => this.setPage("prev") } disabled={this.state.prev}>Prev</Button>
            <Button id="next-btn"onClick={() => this.setPage("next")} disabled={this.state.next}>Next</Button>
          </Col>
          <Clearfix visibleSmBlock><code>&lt;{'Clearfix visibleSmBlock'} /&gt;</code></Clearfix>
          <Col sm={6} md={6}>
            <PlaceMap all={this.props.all}
                      data={this.state.data}
                      selected={this.state.selectedPanel}
                      style={{position: "fixed", width: "100%", maxWidth: "30vw", height: "100%"}}/>
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
