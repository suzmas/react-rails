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

  handleChange = (e) => {
    this.props.onSearchChange(e.target.value)
  }

  handlePosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch(`/location?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
          .then(response => response.json())
          .then(json => {
            this.props.onLocationChange({loc: json})
          })
      }
    )

    document.getElementById("search-bar").value = "Current Location"
  }

  /* TODO:
  ** Better query handling for things that may have incorrect loc
  ** Add way to include current position (already has lat/lng)
  */
  handleLocation = () => {
    let loc = document.getElementById("search-bar").value

    // don't send query when user submits empty loc search
    if (loc === "") {
      this.props.onLocationChange({loc: ""})
      return
    }
    loc = loc.split(" ").join("+")
    let query = `/location?loc=${loc}`
    fetch(query)
      .then(response => response.json())
      .then(json => {
        this.props.onLocationChange({loc: json})
      })
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

  placeKeyword = () => {
    return (
      <FormGroup>
        <FormControl type="text" placeholder="Search" onChange={this.handleChange} id="keyword-input"/>
      </FormGroup>
    )
  }

  handleEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleLocation()
    }
  }

  placeLocation = () => {
    return (
      <FormGroup>
        <InputGroup>
          <FormControl id="search-bar" type="text" placeholder="Enter Location" onKeyUp={this.handleEnter}/>
          <InputGroup.Button>
            <Button onClick={this.handlePosition}><i className="fa fa-map-marker" aria-hidden="true"></i></Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    )
  }

  timeOptions = ([1,2,3,4,5,6,7,8,9,10,11,12])
                .map(i => { return (
                  <Button key={`${i}:00`}
                      onClick={() => this.timeHourChange(i)}>
                      {i}
                  </Button>)})

  dayOptions = (["Monday", "Tuesday", "Wednesday","Thursday","Friday", "Saturday", "Sunday"]).map((item, i) => { return (
                                      <Button key={item}
                                        onClick={() => this.dayChange(item)}>
                                        { [3,5,6].includes(i) ? item.slice(0,2) : item[0] }
                                      </Button>)})
  updateTime = () => {
    const hour = this.state.hourOfDay
    let time = this.state.timeOfDay === "AM" ? hour : `${parseInt(hour) + 12}`
    if (hour === "now") { time = new Date().getHours() }
    if (hour === "") { time = "" }
    this.props.onTimeChange(time)
  }

  timeHourChange = (hour) => {
    let amPm = this.state.timeOfDay
    if (hour === "now") { amPm = "" }
    if (amPm === "") { amPm = "AM" }
    if (hour === "") { amPm = "" }
    this.setState({hourOfDay: hour, timeOfDay: amPm}, this.updateTime)
  }

  timeOfDayChange = () => {
    let val = this.state.timeOfDay === "PM" || "" ?
      "AM" : "PM"
    this.setState({timeOfDay: val}, this.updateTime)
  }

  dayChange = (val) => {
    this.props.onDayChange(val)
    this.setState({dayOfWeek: val})
  }

  placeTime = () => {
    let dropdownLabel =
    (!this.state.dayOfWeek && !this.state.hourOfDay) ?
      <i className="fa fa-clock-o fa-2x navbar-icon-label" aria-hidden="true"></i>
      : `${this.state.dayOfWeek} ${this.state.hourOfDay} ${this.state.timeOfDay}`

    return (
      <div className="filter-group">
        <Dropdown id="clockdrop">
          <Dropdown.Toggle>
            {dropdownLabel}
          </Dropdown.Toggle>
          <Dropdown.Menu>
        <DropdownButton title="On:" key="day-input" id="day-input">
          {this.dayOptions}
        </DropdownButton>
        <DropdownButton title="At:" key="hour-input" id="hour-input">
          <Button key={"any"}
            onClick={() => this.timeHourChange("")}>
            Any
          </Button>
          <Button key={"now"}
            onClick={() => this.timeHourChange("now")}>
            Now
          </Button>
          {this.timeOptions}
        </DropdownButton>
        <Button
          className={(this.state.timeOfDay !== "") ? "btn-active" : "btn-inactive"}
          onClick={() => this.timeOfDayChange("AM")}>
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
            { this.placeKeyword() }
            { this.placeLocation() }
            <Button onClick={() => this.handleLocation()}type="submit"><i className="fa fa-search" aria-hidden="true"></i></Button>
            { this.placeTime() }
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
