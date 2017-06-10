import React from "react"
import PropTypes from "prop-types"
import {Grid, Row, Col, Clearfix, Button, ButtonGroup} from "react-bootstrap"
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
      data: "",
      hasDrink: false,
      hasFood: false,
      hiddenList: true,
      hiddenMap: false,
      length: 0,
      locationData: "",
      next: false,
      page: 0,
      prev: false,
      text: "",
      toggle: {
        isToggled: false,
        selectedPanel: ""
      },
      width: "0",
    }

    this.updateWindow = this.updateWindow.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.view !== nextProps.view) {
      this.setState({page: 0, toggle: {selectedPanel: null, isToggled: false}}, this.handleData)
    }
  }

  componentWillMount() {
    this.handleData()
  }

  componentDidMount() {
    this.updateWindow()
    window.addEventListener("resize", this.updateWindow)
  }

  updateWindow = () => {
    this.setState({width: window.innerWidth}, function() {
      if (this.state.width <= 991) {
        this.setState({hiddenMap: false, hiddenList: true})
      } else {
        this.setState({hiddenMap: false, hiddenList: false})
      }
    })
  }

  handleSearchChange = (text) => {
    text = text.toLowerCase().trim()
    this.setState({page: 0, text: text}, this.handleData)
  }

  handleBool = (obj) => {
    this.setState({page: 0, hasFood: obj.hasFood, hasDrink: obj.hasDrink}, this.handleData)
  }

  handleLocation = (loc) => {
    this.setState({page: 0, locationData: loc.loc}, this.handleData)
  }

  handleSelectedPanel = (id) => {
    if (id !== this.state.toggle.selectedPanel) {
      this.setState({toggle: {
        isToggled: true,
        selectedPanel: id
      }})
    } else {
      (!this.state.toggle.isToggled) ?
        this.setState({toggle: {
          isToggled: true,
          selectedPanel: id
        }}) :
        this.setState({toggle: {
          isToggled: false,
          selectedPanel: null
        }})
    }
  }

  handleTimeChange = (time) => {
    this.setState({page: 0, activeHour: time}, this.handleData)
  }

  handleDayChange = (day) => {
    this.setState({page: 0, activeDay: day}, this.handleData)
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

  filterPagination = (all) => {
    let data = all.data
    let allEvents = all.allEvents
    const length = (this.props.view === "place") ? data.length : allEvents.length
    const start = this.state.page * 5
    const end = this.state.page * 5 + 5

    if (this.props.view == "place") {
      data = data.slice(start, end)
    }
    allEvents = allEvents.slice(start, end)

    return {data: data, allEvents: allEvents, length: length}
  }

  handleData = () => {
    let places = this.state.locationData || JSON.parse(this.props.all)

    if (!places.length) {
      this.setState({data: [], allEvents: [], length: 0}, this.setButtons)
      return
    }

    let allEvents = []
    places.forEach(place => {
      place.events.forEach(event => {
        allEvents.push(event)
      })
    })

    let tmp = {data: places, allEvents: allEvents}

    tmp = this.filterTime(tmp)
    tmp = this.filterKeyword(tmp)
    tmp = this.filterTime(tmp)
    if (this.state.hasFood) { tmp = this.filterBool(tmp, "food") }
    if (this.state.hasDrink) { tmp = this.filterBool(tmp, "drink") }
    tmp = this.filterPagination(tmp)

    this.setState({data: tmp.data, allEvents: tmp.allEvents, length: tmp.length}, this.setButtons)
  }

  setPage = (str) => {
    (str === "prev") ?
      this.setState({page: this.state.page - 1}, this.handleData) :
      this.setState({page: this.state.page + 1}, this.handleData)
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
      hasDrink: false,
      hasFood: false,
      length: 0,
      locationData: "",
      next: false,
      page: 0,
      prev: false,
      text: ""
    }, this.handleData)
  }

  // Adds buttons for mobile view
  addListToggle = () => {
    return (
      <div className="list-btn">
        <ButtonGroup>
          <Button id="map" onClick={() => this.setList("map")} >Map</Button>
          <Button id="list" onClick={() => this.setList("list")}>List</Button>
        </ButtonGroup>
      </div>
    )
  }

  // Changes view for mobile view
  setList = (view) => {
    (view === "map") ?
      this.setState({hiddenMap: false, hiddenList: true}) :
      this.setState({hiddenMap: true, hiddenList: false})
  }

  render() {
    const panel = this.props.view == "place" ?
      <PlacePanel
        data={this.state.data}
        onSelectChange={this.handleSelectedPanel} />
    : <EventPanel
        data={this.state.data}
        allEvents={this.state.allEvents}
        onSelectChange={this.handleSelectedPanel} />

    const toggleList = (this.state.width <= 991) ? this.addListToggle() : null
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
          <Col id="list-view" sm={12} md={6} hidden={this.state.hiddenList}>
            {panel}
            <Button id="prev-btn" onClick={() => this.setPage("prev") } disabled={this.state.prev}>Prev</Button>
            <Button id="next-btn" onClick={() => this.setPage("next")} disabled={this.state.next}>Next</Button>
            {toggleList}
          </Col>
          <Col id="map-view" sm={12} md={6} hidden={this.state.hiddenMap}>
              <PlaceMap
                data={this.state.data}
                selected={this.state.toggle.selectedPanel}
                allEvents={this.state.allEvents}
                view={this.props.view}/>
            {toggleList}
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
