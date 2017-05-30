import React from "react"
import PropTypes from "prop-types"
import {Navbar, FormGroup, FormControl, ControlLabel, Button, DropdownButton, InputGroup} from "react-bootstrap"


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

    // don't send query when user empties loc search
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
                  <option value={i} key={`${i}:00`}>
                    {`${i}:00`}
                  </option>)})

  timeOptionsTwo = ([1,2,3,4,5,6,7,8,9,10,11,12])
                .map(i => { return (
                  <Button key={`${i}:00`}
                      onClick={() => this.timeHourChange(i)}>
                      {i}
                  </Button>)})

  dayOptions = (["Monday", "Tuesday", "Wednesday","Thursday","Friday", "Saturday", "Sunday"]).map(i => { return ( <option value={i} key={i}>
                                    {i[0]}
                                  </option>)})

  dayOptionsTwo = (["Monday", "Tuesday", "Wednesday","Thursday","Friday", "Saturday", "Sunday"]).map((item, i) => { return (
                                      <Button key={item}
                                        onClick={() => this.dayChangeTwo(item)}>
                                        { [3,5,6].includes(i) ? item.slice(0,2) : item[0] }
                                      </Button>)})
  updateTime = () => {
    const hour = this.state.hourOfDay
    if (hour === "") return
    let time = this.state.timeOfDay === "AM" ? hour : `${parseInt(hour) + 12}`
    if (hour === "now") { time = new Date().getHours() }
    this.props.onTimeChange(time)
  }

  timeHourChange = (hour) => {
    if (hour === "now") { this.setState({timeOfDay: ""}) }
    this.setState({hourOfDay: hour}, this.updateTime)
  }

  timeOfDayChange = (val) => {
    this.setState({timeOfDay: val}, this.updateTime)
  }

  dayChange = (e) => {
    this.props.onDayChange(e.target.value)
  }

  dayChangeTwo = (val) => {
    this.props.onDayChange(val)
    this.setState({dayOfWeek: val})
  }

  placeTimeTwo = () => {
    return (
      <DropdownButton bsStyle={"primary"} title={`${this.state.dayOfWeek} ${this.state.hourOfDay} ${this.state.timeOfDay}`} key={"timeButton"} id={"timebutton"}>
        <DropdownButton title="On:" key="day-input" id="day-input">
          {this.dayOptionsTwo}
        </DropdownButton>
        <DropdownButton title="At:" key="hour-input" id="hour-input">
          <Button key={"now"}
            onClick={() => this.timeHourChange("now")}>
            Now
          </Button>
          {this.timeOptionsTwo}
        </DropdownButton>
        <Button
          className={(this.state.timeOfDay === "AM") ? "btn-active" : "btn-inactive"}
          onClick={() => this.timeOfDayChange("AM")}>
          AM
        </Button>
        <Button
          className={(this.state.timeOfDay === "PM") ? "btn-active": "btn-inactive"}
          onClick={() => this.timeOfDayChange("PM")}>
          PM
        </Button>
      </DropdownButton>
    )
  }

  placeTime = () => {
    return (
      <FormGroup>
        <ControlLabel>
          <i className="fa fa-clock-o fa-2x" aria-hidden="true" style={{paddingLeft: "10px", paddingRight: "10px", color: "white"}}></i>
        </ControlLabel>
        <FormControl componentClass="select" placeholder="select" onChange={this.timeHourChange}
        inputRef={ el => this.inputEl = el } id="time-input">
          <option value="">When?</option>
          <option value="now">Now</option>
          { this.timeOptions }
        </FormControl>
        <Button
          className={(this.state.timeOfDay === "AM") ? "btn-active" : "btn-inactive"}
          onClick={this.timeOfDayChange}>
          AM
        </Button>
        <Button
          className={(this.state.timeOfDay === "PM") ? "btn-active": "btn-inactive"}
          onClick={this.timeOfDayChange}>
          PM
        </Button>
      </FormGroup>
    )
  }

  // more performant way to do onClick for button, will fix down the road
  navbarInstance() {
    return (
      <Navbar fixedTop style={{backgroundColor: this.props.primaryColor}} fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a style={{color: this.props.secondaryColor}} href="#">ANFERNE</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form>
            { this.placeKeyword() }
            { this.placeLocation() }
            { this.placeTime() }
            { this.placeTimeTwo() }
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
            <Button onClick={() => this.handleLocation()}type="submit">Submit</Button>
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
