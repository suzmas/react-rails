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
      hiddenList: true,
      hiddenMap: false,
      length: 0,
      locationData: "",
      next: false,
      page: 0,
      prev: false,
      selectedPanel: 0,
      text: "",
      width: "0",
    }

    this.updateWindow = this.updateWindow.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.view !== nextProps.view) {
      this.setState({page: 0, selectedPanel: 0}, this.handleData)
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

    let panel = this.state.selectedPanel === id ? 0 : id
    this.setState({selectedPanel: panel})
  }

  handleTimeChange = (time) => {
    const hour = (time.amPm === "AM") ? time.hour : time.hour + 12
    this.setState({page: 0, activeHour: hour, activeAmPm: time.amPm}, this.handleData)
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
    const start = this.state.page * 10
    const end = this.state.page * 10 + 10

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
    if (this.state.hasFood) { tmp = this.filterBool(tmp, "food") }
    if (this.state.hasDrink) { tmp = this.filterBool(tmp, "drink") }
    tmp = this.filterPagination(tmp)

    let sortedEvents = tmp.allEvents
    // let sortedEvents = this.sortedEvents(tmp.allEvents)
    this.setState({data: tmp.data, allEvents: sortedEvents, length: tmp.length}, this.setButtons)
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

    if ((this.state.page + 1) * 10 >= this.state.length) {
      this.setState({next: true})
    } else {
      this.setState({next: false})
    }
  }


  sortedEvents = (events) => {
    let daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const now = new Date
    let days = daysArr.splice(now.getDay())
    days.concat(daysArr)
    let todayCount = 0

    let newevents = events.sort((a,b) => {
      const aday = days.indexOf(a.dow)
      const bday = days.indexOf(b.dow)

      if (aday === now.getDay()) { todayCount++ }
      if (bday === now.getDay()) { todayCount++ }

      if (aday === bday) {
        return a.start_time - b.start_time
      } else {
        return aday - bday
      }
    })

    if (todayCount > 0) {
      let todayEvents = days.slice(0, todayCount)
      let head = []
      let tail = []
      for (let val in todayEvents) {
        val.start_time >= now.getHours ? head.push(val)
                                       : tail.push(val)
      }
      newevents = head.concat(newevents).concat(tail)
    }

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
      // selectedPanel: 0,
      text: ""
    }, this.handleData)
    // this.collapsePanels()
    // this.handleSelectedPanel(this.state.selectedPanel)
  }

  // collapsePanels = () => {
  //   let panel = this.state.selectedPanel
  //   panel = document.querySelector(`#panel-${panel}`)
  //   if (panel.classList.contains("in")) {
  //     panel.classList.remove("in")
  //     console.log(panel.children)
  //     panel.setAttribute("aria-hidden", true)
  //     panel.setAttribute("style", "height: 0px;")
  //
  //   }
  // }

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
        onSelectChange={this.handleSelectedPanel} />
    : <EventPanel
        data={this.state.data}
        allEvents={this.state.allEvents}
        selected={this.state.selectedPanel}
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
          onViewChange={this.handleViewChange}
          activeAmPm={this.state.activeAmPm}
          activeDay={this.state.activeDay}
          activeHour={this.state.activeHour}
          hasFood={this.state.hasFood}
          hasDrink={this.state.hasDrink}/>
        <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock><code>&lt;{"Clearfix visibleSmBlock"} /&gt;</code></Clearfix>

        <Grid className="body-container">
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
                selected={this.state.selectedPanel}
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
