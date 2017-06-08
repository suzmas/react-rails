import React from "react"
import PropTypes from "prop-types"
import {Navbar, FormGroup, FormControl, Button, Dropdown, DropdownButton, InputGroup, ButtonGroup} from "react-bootstrap"


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

    if (location !== "") { // only fetch if location not empty
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
          <FormControl id="search-bar" type="text" placeholder="Where?" onKeyUp={this.handleEnter}/>
          <InputGroup.Button>
            <Button onClick={this.handleUserPosition}><i className="fa fa-map-marker" aria-hidden="true"></i></Button>
          </InputGroup.Button>
        </InputGroup>
        <Button onClick={() => this.handleLocation()} type="submit" id="location-submit"><i className="fa fa-search" aria-hidden="true"></i></Button>
      </FormGroup>
    )
  }

  timeOptions = () => {
    let timeButtons =
      ([1,2,3,4,5,6,7,8,9,10,11,12]).map(i => {
        return (<Button key={i}
                  onClick={() => this.hourChange(i)}>
                    {i}
                </Button>)})
    let groups = []
    for (let i=0; i<4; i++) {
      groups.push(<ButtonGroup className="hour-group" key={i} justified> { timeButtons.splice(0,3) } </ButtonGroup>)
    }
    return groups
  }

  dayOptions = (["Monday", "Tuesday", "Wednesday","Thursday","Friday",
    "Saturday", "Sunday"]).map((day) => {
      return ( <Button key={day}
                onClick={() => this.dayChange(day)}>
                { day }
               </Button>)} )

  updateTime = () => {
    const hour = this.state.hourOfDay
    let time = this.state.timeOfDay === "AM" ? hour : hour + 12
    if (hour === "now") {
      time = new Date().getHours()
      this.dayChange("now")
    }
    if (hour === "") { time = "" }
    this.props.onTimeChange(time)
  }

  setTimeNow = () => {
    const now = new Date
    const hour = now.getHours() < 13 ? now.getHours() : now.getHours() - 12
    const amPm = now.getHours() < 13 ? "AM" : "PM"
    const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][ now.getDay() ]
    this.setState({hourOfDay: hour, timeOfDay: amPm, dayOfWeek: day},
       this.updateTime, this.props.onDayChange(day) )
  }
  // change this to be less ugly...
  hourChange = (hour) => {
    let amPm = this.state.timeOfDay
    if (hour === "now") {
      hour = new Date.getHours()
      amPm = hour < 13 ? "AM" : "PM"
    }
    if (amPm === "") { amPm = "AM" }
    if (hour === "") { amPm = "" }
    this.setState({hourOfDay: hour, timeOfDay: amPm}, this.updateTime)
  }

  amPmChange = () => {
    let val = this.state.timeOfDay === "PM" ?
      "AM" : "PM"
    this.setState({timeOfDay: val}, this.updateTime)
  }

  dayChange = (val) => {
    if (val === "now") {
      let indice = new Date().getDay()
      val = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][indice-1]
      this.setState({dayOfWeek: val})
      this.props.onDayChange(val)
    } else {
      this.setState({dayOfWeek: val})
      this.props.onDayChange(val)
    }
  }

  timeMenu = () => {
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
            onClick={() => this.setTimeNow() }>
            Now
          </Button>
          <DropdownButton title="On:" key="day-input" id="day-input">
            <ButtonGroup vertical block>
            { this.dayOptions }
            </ButtonGroup>
          </DropdownButton>
          <DropdownButton title="At:" key="hour-input" id="hour-input">
            <ButtonGroup>
            { this.timeOptions() }
            </ButtonGroup>
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

  resetFilters = () => {
    this.props.resetFilters()
    this.setState({hasFood: false, hasDrink: false, hourOfDay: "",
      timeOfDay: "", dayOfWeek: ""})
  }

  // more performant way to do onClick for button, will fix down the road
  navbarInstance() {
    return (
      <Navbar fixedTop className="navbar-main" fluid>
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
            { this.timeMenu() }
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
            <div className="filter-group">
              <Button onClick={() => this.handleViewChange("place")}>
                Places</Button>
              <Button onClick={() => this.handleViewChange("event")}>
                Events</Button>
            </div>
            <Button><a href="#">Clear</a></Button>
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
  resetFilters: PropTypes.func,
}
