import React, { PropTypes } from "react";

// import {Panel, Accordion} from "react-bootstrap"; // previously had PanelGroup

import NavBar from "./navbar";
import SimpleExample from "./Map";
import Item from "./Panel";

export default class Place extends React.Component {
    static propTypes = {
        all: PropTypes.string.isRequired, // this is passed from the Rails view
    };

  /*
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */

    // Do we need _railsContext?
    // constructor(props, _railsContext) {
    //     super(props);
    // }
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {data: ""};
    }

    // Filters and changes data state
    handleChange(text) {
        let places = this.props.all;
        places = JSON.parse(places);

        let data = places
        .filter(place => {
            return place.place.name.toLowerCase().includes(text.toLowerCase().trim());
        });
        this.setState({data: data});
    }

    render() {
        const text = "";
        return (
      <div>
        <NavBar text={text} onSearchChange={this.handleChange} />
        <Item all={this.props.all} data={this.state.data}/>
        <SimpleExample all={this.props.all} data={this.state.data} />
      </div>
        );
    }
}
