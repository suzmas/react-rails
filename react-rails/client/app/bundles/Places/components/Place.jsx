import React, { PropTypes } from "react";

import {Panel, Accordion} from "react-bootstrap"; // previously had PanelGroup

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
    }

    render() {
        return (
      <div>
        <NavBar />
        <Item all={this.props.all} />
        <SimpleExample all={this.props.all} />
      </div>
        );
    }
}
