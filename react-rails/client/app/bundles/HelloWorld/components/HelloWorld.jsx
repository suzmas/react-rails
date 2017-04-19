import React, { PropTypes } from 'react';
import ReactBootstrap from 'react-bootstrap'
import {Button} from 'react-bootstrap'

export default class HelloWorld extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = { name: this.props.name };
  }

  updateName = (name) => {
    this.setState({ name });
  };
// AIzaSyD5AvSyr-ErRWS52UO2CDBNT-5PO7c8O_o

  searchLocations = () => {
    let gplaceSearch =
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=happy_hour&key=AIzaSyD5AvSyr-ErRWS52UO2CDBNT-5PO7c8O_o'
    let locations = fetch(gplaceSearch).then((l) => {
      console.log(l);
    });
  }

  render() {
    return (
      <div>
        <h3>
          Hello, {this.state.name}!
        </h3>
        <hr />
        <form >
          <label htmlFor="name">
            Say hello to:
          </label>
          <input
            id="name"
            type="text"
            value={this.state.name}
            onChange={(e) => this.updateName(e.target.value)}
          />
        </form>
        <Button bsStyle="success" bsSize="large" onClick={this.searchLocations()}>Button</Button>
      </div>
    );
  }
}
