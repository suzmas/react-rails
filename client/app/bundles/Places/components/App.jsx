import React from "react"
import PropTypes from "prop-types"

import View from "./View"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleViewChange = this.handleViewChange.bind(this)
    this.state = { view: "place" }
  }

  handleViewChange(view) {
    this.setState({view: view})
  }


  render() {
    return (
      <div>
        <View
          view={this.state.view}
          all={this.props.all}
          onViewChange={this.handleViewChange}/>
      </div>
    )
  }
}

App.propTypes = {
  all: PropTypes.string.isRequired, // this is passed from the Rails view
}
