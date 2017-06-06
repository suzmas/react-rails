import React from "react"
import PropTypes from "prop-types"
import {Navbar, FormGroup, FormControl, Button, Dropdown, DropdownButton, InputGroup} from "react-bootstrap"


export default class NavBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasFood: false,
      hasDrink: false,
      hourOfDay: "",
      timeOfDay: "",
      dayOfWeek: ""
    }
  }

  handleSearchChange = (e) => {
    this.props.onSearchChange(e.target.value)
  }

  handleUserPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch(`/location?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
          .then(response => response.json())
          .then(json => { this.props.onLocationChange({loc: json}) })
      })
    document.getElementById("search-bar").value = "Current Location"
  }

  handleLocation = () => {
    let location = document.getElementById("search-bar").value

    if (location !== "") { // don't fetch for empty search
      location = location.split(" ").join("+")
      let query = `/location?loc=${location}`
      fetch(query)
        .then(response => response.json())
        .then(json => {
          this.props.onLocationChange({loc: json})
        })
    } else {
      this.props.onLocationChange({loc: ""})
    }
  }

  handleBool = (type) => {
    switch (type) {
    case "food":
      this.setState({hasFood: (this.state.hasFood) ? false : true}, function() {
        this.props.onBoolChange({hasFood: this.state.hasFood, hasDrink: this.state.hasDrink})
      })
      break
    case "drink":
      this.setState({hasDrink: (this.state.hasDrink) ? false: true}, function() {
        this.props.onBoolChange({hasFood: this.state.hasFood, hasDrink: this.state.hasDrink})
      })
      break
    }
  }

  handleViewChange = (view) => {
    this.props.onViewChange(view)
  }

  keywordSearch = () => {
    return (
      <FormGroup className="filter-group">
        <FormControl type="text" placeholder="Search"
          onChange={this.handleSearchChange} id="keyword-input"/>
      </FormGroup>
    )
  }

  // Submit location search on 'return' keydown
  handleEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleLocation()
    }
  }

  placeLocation = () => {
    return (
      <FormGroup className="filter-group">
        <InputGroup>
          <FormControl id="search-bar" type="text" placeholder="Enter Location" onKeyUp={this.handleEnter}/>
          <InputGroup.Button>
            <Button onClick={this.handleUserPosition}><i className="fa fa-map-marker" aria-hidden="true"></i></Button>
          </InputGroup.Button>
        </InputGroup>
        <Button onClick={() => this.handleLocation()} type="submit" id="location-submit"><i className="fa fa-search" aria-hidden="true"></i></Button>
      </FormGroup>
    )
  }

  timeOptions = ([1,2,3,4,5,6,7,8,9,10,11,12])
                .map(i => { return (
                  <Button key={i}
                      onClick={() => this.hourChange(i)}>
                      {i}
                  </Button>)})

  dayOptions = (["Monday", "Tuesday", "Wednesday","Thursday","Friday", "Saturday", "Sunday"]).map((item, i) => {
    return (  <Button key={item}
                onClick={() => this.dayChange(item)}>
                { [3,5,6].includes(i) ? item.slice(0,2) : item[0] }
              </Button>)})

  updateTime = () => {
    const hour = this.state.hourOfDay
    let time = this.state.timeOfDay === "AM" ? hour : `${parseInt(hour) + 12}`
    if (hour === "now") {
      time = new Date().getHours()
      this.dayChange("now")
    }
    if (hour === "") { time = "" }
    this.props.onTimeChange(time)
  }

  // change this to be less ugly...
  hourChange = (hour) => {
    let amPm = this.state.timeOfDay
    if (amPm === "") { amPm = "AM" }
    if (hour === "") { amPm = "" }
    if (hour === "now") { amPm = "" }
    this.setState({hourOfDay: hour, timeOfDay: amPm}, this.updateTime)
  }

  amPmChange = () => {
    let val = this.state.timeOfDay === "PM" || "" ?
      "AM" : "PM"
    this.setState({timeOfDay: val}, this.updateTime)
  }

  dayChange = (val) => {

    if (val === "now") {
      let indice = new Date().getDay()
      val = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][indice-1]
      this.setState({dayOfWeek: ""})
      this.props.onDayChange(val)
    } else {
      this.setState({dayOfWeek: val})
      this.props.onDayChange(val)
    }
  }

  timeOptions = () => {
    let dropdownLabel =
    (!this.state.dayOfWeek && !this.state.hourOfDay) ?
      <i className="fa fa-clock-o fa-lg" aria-hidden="true"></i>
      : `${this.state.dayOfWeek} ${this.state.hourOfDay} ${this.state.timeOfDay}`

    return (
    <div className="filter-group">
      <Dropdown id="time-dropdown">
        <Dropdown.Toggle>
          {dropdownLabel}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Button key={"now"}
            onClick={() => this.hourChange("now")}>
            Now
          </Button>
          <DropdownButton title="On:" key="day-input" id="day-input">
            {this.dayOptions}
          </DropdownButton>
          <DropdownButton title="At:" key="hour-input" id="hour-input">
            <Button key={"any"}
              onClick={() => this.hourChange("")}>
              Any
            </Button>
            {this.timeOptions}
          </DropdownButton>
          <Button
            disabled={ parseInt(this.state.hourOfDay) ? false : true }
            id="amPm-toggle"
            onClick={() => this.amPmChange("AM")}>
            {this.state.timeOfDay === "PM" ? "PM" : "AM"}
          </Button>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    )
  }

  // more performant way to do onClick for button, will fix down the road
  navbarInstance() {
    return (
      <Navbar fixedTop style={{backgroundColor: this.props.primaryColor}} fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">A</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form>
            { this.keywordSearch() }
            { this.placeLocation() }
            { this.timeOptions() }
            <Button
              className={(this.state.hasFood) ? "btn-active" : "btn-inactive"}
              onClick={() => this.handleBool("food")} id="has-food">
              <i className="fa fa-cutlery" aria-hidden="true"></i>
            </Button>
            <Button
              className={(this.state.hasDrink) ? "btn-active": "btn-inactive"}
              onClick={() => this.handleBool("drink")} id="has-drink">
              <i className="fa fa-beer" aria-hidden="true"></i>
            </Button>
            {" "}
            <Button onClick={() => this.handleViewChange("place")}>Places</Button>
            <Button onClick={() => this.handleViewChange("event")}>Events</Button>
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  render() {
    return (
      <div>
        {this.navbarInstance()}
      </div>
    )
  }
}

NavBar.propTypes = {
  onSearchChange: PropTypes.func,
  onLocationChange: PropTypes.func,
  onBoolChange: PropTypes.func,
  onViewChange: PropTypes.func,
  onTimeChange: PropTypes.func,
  onDayChange: PropTypes.func,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
}
