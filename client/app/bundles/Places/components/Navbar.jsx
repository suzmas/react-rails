import React from "react"
import PropTypes from "prop-types"
import {Navbar, Form, FormGroup, FormControl, Button, Dropdown, DropdownButton, InputGroup, ButtonGroup} from "react-bootstrap"

/*
** TODO: Make navbar more responsive
*/
export default class NavBar extends React.Component {

  // componentDidMount() {
  //   const navbarToggle = document.getElementsByClassName("navbar-toggle")
  //   const iconBars = document.getElementsByClassName("icon-bar")
  //   while(iconBars.length > 0) {
  //     iconBars[0].parentNode.removeChild(iconBars[0])
  //   }
  //
  //   navbarToggle[0].insertAdjacentHTML('beforeend', '<i class="fa fa-filter" aria-hidden="true"></i>')
  // }

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

    // only fetch if location not empty
    if (location !== "") {
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
      this.props.onBoolChange({hasFood: (this.props.hasFood) ? false : true, hasDrink: this.props.hasDrink})
      break
    case "drink":
      this.props.onBoolChange({hasFood: this.props.hasFood, hasDrink: (this.props.hasDrink) ? false :true})
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
        <FormControl id="search-bar" type="text" placeholder="Where?" onKeyUp={this.handleEnter} />
      </FormGroup>
    )
  }
  // placeLocation = () => {
  //   return (
  //     <FormGroup className="filter-group">
  //       <InputGroup>
  //         <FormControl id="search-bar" type="text" placeholder="Where?" onKeyUp={this.handleEnter}/>
  //         <InputGroup.Button>
  //           <Button onClick={this.handleUserPosition}><i className="fa fa-map-marker" aria-hidden="true"></i></Button>
  //         </InputGroup.Button>
  //       </InputGroup>
  //       <Button onClick={() => this.handleLocation()} type="submit" id="location-submit"><i className="fa fa-search" aria-hidden="true"></i></Button>
  //     </FormGroup>
  //   )
  // }

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


  setTimeNow = () => {
    const now = new Date
    const hour = now.getHours() < 13 ? now.getHours() : now.getHours() - 12
    const amPm = now.getHours() < 13 ? "AM" : "PM"
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][ now.getDay() ]
    this.updateTime(amPm, hour)
    this.props.onDayChange(day)
  }

  updateTime = (amPm, hour) => {
    this.props.onTimeChange({hour: hour, amPm: amPm})
  }

  hourChange = (hour) => {
    let amPm = this.props.activeAmPm
    this.updateTime(amPm, hour)
  }

  amPmChange = () => {
    const val = (this.props.activeAmPm === "PM") ? "AM" : "PM"
    const hour = (this.props.activeHour > 12) ? this.props.activeHour - 12 : this.props.activeHour
    this.updateTime(val, hour)
  }

  dayChange = (val) => {
    this.props.onDayChange(val)
  }

  timeMenu = () => {
    const hour = this.props.activeHour > 12 ? this.props.activeHour - 12 : this.props.activeHour
    const amPm = this.props.activeAmPm
    const day = this.props.activeDay
    let dropdownLabel =
    (!day && !hour) ?
      <i className="fa fa-clock-o fa-lg" aria-hidden="true"></i>
      : `${day} ${hour} ${amPm}`

    return (
    <div className="filter-group">
      <Dropdown id="time-dropdown">
        <Dropdown.Toggle>
          {dropdownLabel}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Button key={"now"}
            onClick={() => this.setTimeNow()}>
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
            disabled={ hour ? false : true }
            id="amPm-toggle"
            onClick={() => this.amPmChange()}>
            {amPm}
          </Button>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    )
  }

  resetFilters = () => {
    this.props.resetFilters()
    // this.setState({hourOfDay: "", timeOfDay: "", dayOfWeek: ""})
  }

  // navbarInstance() {
  //   return (
  //     <Navbar fixedTop className="navbar-main" fluid>
  //       <Navbar.Header>
  //         <Navbar.Brand>
  //           <a href="#">A</a>
  //         </Navbar.Brand>
  //         <Navbar.Toggle />
  //       </Navbar.Header>
  //       <Navbar.Collapse>
  //         <Navbar.Form>
  //           { this.keywordSearch() }
  //           { this.placeLocation() }
  //           { this.timeMenu() }
  //           <Button
  //             className={(this.props.hasFood) ? "btn-active" : "btn-inactive"}
  //             onClick={() => this.handleBool("food")} id="has-food">
  //             <i className="fa fa-cutlery" aria-hidden="true"></i>
  //           </Button>
  //           <Button
  //             className={(this.props.hasDrink) ? "btn-active": "btn-inactive"}
  //             onClick={() => this.handleBool("drink")} id="has-drink">
  //             <i className="fa fa-beer" aria-hidden="true"></i>
  //           </Button>
  //           {" "}
  //           <div className="filter-group">
  //             <Button onClick={() => this.handleViewChange("place")}>
  //               Places</Button>
  //             <Button onClick={() => this.handleViewChange("event")}>
  //               Events</Button>
  //           </div>
  //           <Button id="reset-button" onClick={() => this.resetFilters() }>Reset</Button>
  //         </Navbar.Form>
  //       </Navbar.Collapse>
  //     </Navbar>
  //   )
  // }
  firstNavbar() {
    const viewButton = this.props.view === "place" ?
      <Button onClick={() => this.handleViewChange("event")}>Places</Button> :
      <Button onClick={() => this.handleViewChange("place")}>Events</Button>

    return (
      <Navbar fixedTop className="navbar-main" fluid>
            <Navbar.Brand>
              <a href="#">A</a>
            </Navbar.Brand>
          <Navbar.Form pullLeft>
            <FormGroup>
            {viewButton}
            <FormControl type="text" placeholder="Search"
              onChange={this.handleSearchChange} id="keyword-input"/>
            <Button onClick={this.handleUserPosition} id="current-location">
              <i className="fa fa-map-marker" aria-hidden="true"></i>
            </Button>
            <FormControl id="search-bar" type="text" placeholder="Where?" onKeyUp={this.handleEnter} />
            <Button onClick={() => this.handleLocation()} type="submit" id="location-submit">
              <i className="fa fa-search" aria-hidden="true"></i>
            </Button>
            </FormGroup>
          </Navbar.Form>
      </Navbar>
    )
  }

  secondNavbar() {
    return (
      <Navbar fixedTop className="navbar-lower" fluid>
        <Navbar.Form pullLeft>
          { this.timeMenu() }
          <Button
            className={(this.props.hasFood) ? "btn-active" : "btn-inactive"}
            onClick={() => this.handleBool("food")} id="has-food">
            <i className="fa fa-cutlery" aria-hidden="true"></i>
          </Button>
          <Button
            className={(this.props.hasDrink) ? "btn-active": "btn-inactive"}
            onClick={() => this.handleBool("drink")} id="has-drink">
            <i className="fa fa-beer" aria-hidden="true"></i>
          </Button>
          {" "}
          <Button id="reset-button" onClick={() => this.resetFilters() }>Reset</Button>
        </Navbar.Form>
      </Navbar>
    )
  }

  render() {
    return (
      <div>
        {this.firstNavbar()}
        <div></div>
        {this.secondNavbar()}
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
