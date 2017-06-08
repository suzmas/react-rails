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
      locationData: "",
      next: false,
      page: 0,
      prev: false,
      selectedPanel: "",
      text: "",
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.view !== nextProps.view) {
      this.setState({changed: true, page: 0, selectedPanel: null}, this.handleData)
    }
  }

  componentWillMount() {
    this.handleData()
  }

  handleSearchChange = (text) => {
    text = text.toLowerCase().trim()
    this.setState({ text: text }, this.handleData)
  }

  handleBool = (obj) => {
    this.setState({ hasFood: obj.hasFood, hasDrink: obj.hasDrink }, this.handleData)
  }

  handleLocation = (loc) => {
    this.setState({ locationData: loc.loc }, this.handleData)
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

  filterTime = (all) => {
    let data = all.data.filter(place => {
      return this.filterTimeEvents(place.events).length > 0
    })
    let allEvents = this.filterTimeEvents(all.allEvents)

    return {data: data, allEvents: allEvents}
  }

  filterTimeEvents = (events) => {
    const hoursOfDay = []
    for (let i=0; i<25; i++) { hoursOfDay.push(i) }

    events = events.filter(event => {
      const hoursOfEvent = hoursOfDay.slice(hoursOfDay[event.start_time],
                                            hoursOfDay[event.end_time])
      // if filters not set, filter events by their own props (= return all)
      const activeHour = (this.state.activeHour || event.start_time)
      const activeDay = (this.state.activeDay || event.dow)
      return ((hoursOfEvent.includes(activeHour)) && (event.dow === activeDay))
    })
    return events
  }

  filterKeyword = (all) => {
    let places = all.data.filter(place => {
      const name = place.place.name.toLowerCase()
      return name.includes(this.state.text)
    })

    let placeEvents = []
    places.forEach(place => {
      placeEvents.concat(place.events)
    })

    let allEvents = all.allEvents.filter(event => {
      let name = event.name.toLowerCase().includes(this.state.text)
      let menu = false
      for (let key in event.menu) {
        key = key.toLowerCase().trim()
        if (key.includes(this.state.text)) {
          menu = true
          break
        }
      }
      return name || menu
    })
    let eventMatches = placeEvents.concat(allEvents)
    let eventIds = []
    allEvents = eventMatches.filter(event => {
      if (!eventIds.includes(event.id)) {
        eventIds.push(event.id)
        return true
      }
    })
    return {data: places, allEvents: allEvents}
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
    let places = this.state.locationData || JSON.parse(this.props.all)

    if (!places.length) {
      this.setState({data: [], allEvents: [], length: 0}, this.setButtons)
      this.setState({changed: false})
      return
    }

    let allEvents = []
    places.forEach(place => {
      place.events.forEach(event => {
        allEvents.push(event)
      })
    })

    let tmp = {data: places, allEvents: allEvents}

    //Filter by time
    tmp = this.filterTime(tmp)

    //Filter by keyword
    tmp = this.filterKeyword(tmp)

    //Filter by time
    tmp = this.filterTime(tmp)

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
    if (this.props.view == "place") {
      tmp.data = tmp.data.slice(start, end)
    }
    tmp.allEvents = tmp.allEvents.slice(start, end)

    //Checks to see if page changed, instead of filters changing
    if (!this.state.changed) {
      this.setState({page: 0, prev: true, next: false, length: length}, function() {
        start = 0
        end = start + 5
        if (this.props.view == "place") {
          tmp.data = tmp.data.slice(start, end)
        }
        tmp.allEvents = tmp.allEvents.slice(start, end)
        this.setState({data: tmp.data, allEvents: tmp.allEvents}, this.setButtons)
        return
      })
    }

    this.setState({data: tmp.data, allEvents: tmp.allEvents, length: length}, this.setButtons)
    this.setState({changed: false})
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

  clearFilters = () => {
    document.getElementById("keyword-input").value = ""
    document.getElementById("search-bar").value = ""
    this.setState({
      activeDay: "",
      activeHour: "",
      // allEvents: "",
      changed: false,
      hasDrink: false,
      hasFood: false,
      length: 0,
      locationData: "",
      next: false,
      page: 0,
      prev: false,
      selectedPanel: "",
      text: ""
    }, this.handleData)
  }

  render() {
    let panel = this.props.view == "place" ?
      panel = <PlacePanel
        data={this.state.data}
        onSelectChange={this.handleSelectedPanel} />
    : panel = <EventPanel
        data={this.state.data}
        allEvents={this.state.allEvents}
        onSelectChange={this.handleSelectedPanel} />
    return (
      <div>
        <NavBar
          onSearchChange={this.handleSearchChange}
          onBoolChange={this.handleBool}
          onLocationChange={this.handleLocation}
          onTimeChange={this.handleTimeChange}
          onDayChange={this.handleDayChange}
          resetFilters={this.clearFilters}
          onViewChange={this.handleViewChange}/>
        <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock><code>&lt;{"Clearfix visibleSmBlock"} /&gt;</code></Clearfix>

        <Grid>
        <Row>
          <Col sm={12} md={6}>
            {panel}
            <Button id="prev-btn" onClick={() => this.setPage("prev") } disabled={this.state.prev}>Prev</Button>
            <Button id="next-btn" onClick={() => this.setPage("next")} disabled={this.state.next}>Next</Button>
          </Col>
          <Col sm={12} md={6}>
            <PlaceMap data={this.state.data}
              selected={this.state.selectedPanel}/>
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
