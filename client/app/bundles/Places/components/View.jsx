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
      activeAmPm: "AM",
      activeDay: "",
      activeHour: "",
      allEvents: "",
      data: "",
      hasDrink: false,
      hasFood: false,
      hiddenList: false,
      hiddenMap: true,
      length: 0,
      locationData: "",
      next: false,
      page: 0,
      panelId: "",
      prev: false,
      selectedPanel: "",
      showEvents: "",
      showing: false,
      showType: "",
      text: "",
      width: "0",
    }

    this.updateWindow = this.updateWindow.bind(this)
  }
  componentWillReceiveProps() {
    this.state.showing ?
      this.setState({page: 0, showing: false}, this.handleShowEvents) :
      this.setState({page: 0, selectedPanel: "", showEvents: "", showType: ""}, this.handleData)
  }

  componentWillMount() {
    this.handleData()
  }

  componentDidMount() {
    this.updateWindow()
    window.addEventListener("resize", this.updateWindow)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindow)
  }

  updateWindow = () => {
    this.setState({width: window.innerWidth}, function() {
      if (this.state.width <= 991) {
        this.setState({hiddenMap: true, hiddenList: false})
      } else {
        this.setState({hiddenMap: false, hiddenList: false})
      }
    })
  }

  handleSearchChange = (text) => {
    text = text.toLowerCase().trim()
    this.setState({page: 0, showEvents: "", text: text}, this.handleData)
  }

  handleBool = (obj) => {
    this.setState({page: 0, showEvents: "", hasFood: obj.hasFood, hasDrink: obj.hasDrink}, this.handleData)
  }

  handleLocation = (loc) => {
    this.setState({page: 0, showEvents: "", locationData: loc.loc}, this.handleData)
  }

  handleId = (id) => {
    this.setState({panelId: id, showing: true, showType: "multi"}, () =>
      this.handleViewChange("events"))
  }

  handlePanelEventId = (id) => {
    this.setState({panelEventId: id, showing: true, showType: "single"}, () =>
      this.handleViewChange("events"))
  }

  handleSelectedPanel = (id) => {
    let panel = this.state.selectedPanel === id ? "" : id
    this.setState({selectedPanel: panel})
  }

  handleTimeChange = (time) => {
    const hour = (time.amPm === "AM") ? time.hour : time.hour + 12
    this.setState({page: 0, showEvents: "", activeHour: hour, activeAmPm: time.amPm}, this.handleData)
  }

  handleDayChange = (day) => {
    this.setState({page: 0, showEvents: "", activeDay: day}, this.handleData)
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
      // if filter not set, filter events by their own props (= return all)
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
    const start = this.state.page * 10
    const end = this.state.page * 10 + 10

    data = data.slice(start, end)
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
    if (this.state.hasFood) { tmp = this.filterBool(tmp, "food") }
    if (this.state.hasDrink) { tmp = this.filterBool(tmp, "drink") }
    tmp = this.filterPagination(tmp)

    let sortedEvents = this.sortedEvents(tmp.allEvents)
    this.setState({data: tmp.data, allEvents: sortedEvents, length: tmp.length, selectedPanel: ""}, this.setButtons)
  }

  handleShowEvents = () => {
    const places = JSON.parse(this.props.all)
    let place = places.find((place) => { return place.place.id === this.state.selectedPanel })
    let showEvents = []

    if (this.state.showType === "multi") {
      place.events.forEach(event => {
        showEvents.push(event)
      })
    } else if (this.state.showType === "single") {
      place.events.forEach(event => {
        if (event.id === this.state.panelEventId) {
          showEvents.push(event)
        }
      })
    }
    this.setState({showEvents: showEvents, length: showEvents.length, selectedPanel: showEvents[0].id.toString()}, this.setButtons)
  }

  setPage = (str) => {
    (str === "prev") ?
      this.setState({page: this.state.page - 1}, this.handleData) :
      this.setState({page: this.state.page + 1}, this.handleData)
    document.getElementById('list-view').scrollTop = 0
  }

  setButtons() {
    if (this.state.page === 0) {
      this.setState({prev: true})
    } else {
      this.setState({prev: false})
    }

    if ((this.state.page + 1) * 10 >= this.state.length) {
      this.setState({next: true})
    } else {
      this.setState({next: false})
    }
  }


  sortedEvents = (events) => {
    let daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const now = new Date
    const nowInt = (now.getDay() * 24) + now.getHours()

    let timeInt = (event) => {
      let dayInt = daysArr.indexOf(event.dow) * 24
      return dayInt + event.start_time
    }
    let newevents = events.sort((a,b) => {
      let aToNow = timeInt(a) - nowInt
      let bToNow = timeInt(b) - nowInt

      if (aToNow && bToNow < 0) {
        return aToNow - bToNow
      }
      if (aToNow < 0) { aToNow = nowInt + aToNow }
      if (bToNow < 0) { bToNow = nowInt + bToNow }

      // console.log(a.dow + " " + a.start_time + " a value is " + aToNow)
      // console.log(b.dow + " " + b.start_time + " b value " + bToNow)
      // console.log("time now is " + nowInt)
      return aToNow - bToNow
    })
    return newevents
  }

  clearFilters = () => {
    document.getElementById("keyword-input").value = ""
    document.getElementById("search-bar").value = ""
    this.setState({
      activeAmPm: "AM",
      activeDay: "",
      activeHour: "",
      hasDrink: false,
      hasFood: false,
      length: 0,
      locationData: "",
      next: false,
      page: 0,
      prev: false,
      selectedPanel: 0,
      showEvents: "",
      showing: false,
      showType: "",
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
        selected={this.state.selectedPanel}
        onSelectChange={this.handleSelectedPanel}
        panelId={this.handleId}
        panelEventId={this.handlePanelEventId}/>
    : <EventPanel
        data={this.state.data}
        selected={this.state.selectedPanel}
        allEvents={this.state.allEvents}
        onSelectChange={this.handleSelectedPanel}
        showEvents={this.state.showEvents} />

    const map = !this.state.hiddenMap ?
      <PlaceMap
        data={this.state.data}
        selected={this.state.selectedPanel}
        allEvents={this.state.allEvents}
        view={this.props.view}
        showEvents={this.state.showEvents}
        onSelectChange={this.handleSelectedPanel}/>
      : ""
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
          onViewChange={this.handleViewChange}
          activeAmPm={this.state.activeAmPm}
          activeDay={this.state.activeDay}
          activeHour={this.state.activeHour}
          hasFood={this.state.hasFood}
          hasDrink={this.state.hasDrink}
          view={this.props.view}/>
        <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock><code>&lt;{"Clearfix visibleSmBlock"} /&gt;</code></Clearfix>

        <Grid className="body-container">
        <Row>
          <Col id="list-view" sm={12} md={6} hidden={this.state.hiddenList}>
            {panel}
            <Button id="prev-btn" onClick={() => this.setPage("prev") } disabled={this.state.prev}>
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </Button>
            <Button id="next-btn" onClick={() => this.setPage("next")} disabled={this.state.next}>
              <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </Button>
            {toggleList}
          </Col>
          <Col id="map-view" sm={12} md={6} hidden={this.state.hiddenMap}>
            {map}
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
