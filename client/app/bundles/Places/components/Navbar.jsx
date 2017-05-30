import React from "react"
import PropTypes from "prop-types"
import {Navbar, FormGroup, FormControl, ControlLabel, Button, DropdownButton, MenuItem, InputGroup} from "react-bootstrap"


export default class NavBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasFood: false,
      hasDrink: false,
      hourOfDay: "",
      timeOfDay: "AM",
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

  dayOptions = (["Monday", "Tuesday", "Wednesday","Thursday","Friday", "Saturday", "Sunday"]).map(i => { return ( <option value={i} key={i}>
                                    {i[0]}
                                  </option>)})

  dayOptionsTwo = (["Monday", "Tuesday", "Wednesday","Thursday","Friday", "Saturday", "Sunday"]).map(i => { return (
                                  <MenuItem eventKey={i} onSelect={this.dayChangeTwo}>
                                    {i[0]}
                                  </MenuItem>)})
  updateTime = (hour) => {
    if (hour === "") return
    let time = this.state.timeOfDay === "AM" ? hour : `${parseInt(hour) + 12}`
    if (hour === "now") { time = new Date().getHours() }
    this.props.onTimeChange(time)
  }

  timeHourChange = () => {
    const hour = this.inputEl.value
    this.updateTime(hour)
  }

  timeOfDayChange = () => {
    this.state.timeOfDay === "AM" ?
      this.setState({timeOfDay: "PM"}, this.timeHourChange) :
      this.setState({timeOfDay: "AM"}, this.timeHourChange)
  }

  dayChange = (e) => {
    this.props.onDayChange(e.target.value)
  }

  dayChangeTwo = (e) => {
    this.props.onDayChange(e)
  }

  placeTimeTwo = () => {
    return (
      <DropdownButton bsStyle={"primary"} title={this.state.dayOfWeek + this.state.hourOfDay + this.state.timeOfDay} key={"timeButton"} id={"timebutton"}>
        <DropdownButton eventKey="1" title="On:" key="On">
          {this.dayOptionsTwo}
        </DropdownButton>
      </DropdownButton>
    )
  }

  placeTime = () => {
    return (
      <FormGroup>
        <ControlLabel>
          <i className="fa fa-clock-o fa-2x" aria-hidden="true" style={{paddingLeft: "10px", paddingRight: "10px", color: "white"}}></i>
        </ControlLabel>
        <FormControl componentClass="select" placeholder="select" onChange={this.dayChange}
        inputRef={ el => this.inputEl = el } id="day-input">
          <option value="">On:</option>
          {this.dayOptions}
        </FormControl>
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
