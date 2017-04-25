import React, { PropTypes } from 'react';
import ReactBootstrap from 'react-bootstrap'
import {Button} from 'react-bootstrap'

export default class Places extends React.Component {
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
    this.state = { name: "bler" };
  }

  updateName = (name) => {
    this.setState({ name });
  };

  logContents = () => {
    const places = (this.props.name);
    console.log(places);
    console.log(JSON.parse(places));
  }

  placeList = () => {
    let places = this.props.name;
    places = JSON.parse(places);
    for (let i = 0; i < places.length; i++ ) {
      console.log(places[i].name);
    }
    // map places to dom elements
    return (
      <div>
      </div>
    );
  }



  render() {
    return (
      <div>
        {this.placeList()}
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
        <Button bsStyle="success"
                bsSize="large"
                onClick={this.logContents()}>Button</Button>
      </div>
    );
  }
}