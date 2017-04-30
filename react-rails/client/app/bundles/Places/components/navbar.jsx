import React from 'react';
import ReactBootstrap from 'react-bootstrap';
import {Navbar, FormGroup, FormControl, Button} from 'react-bootstrap';


export default class NavBar extends React.Component {
  static propTypes = {
  };

  /*
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
  }

  navbarInstance() {
    return (
    <Navbar fixedTop="true">
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">COOL BRAND HERE</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Navbar.Form pullLeft>
          <FormGroup>
            <FormControl type="text" placeholder="Search" />
          </FormGroup>
          {' '}
          <Button type="submit">Submit</Button>
        </Navbar.Form>
      </Navbar.Collapse>
    </Navbar>
  )}

  render() {
    return (
      <div>
        {this.navbarInstance()}
      </div>
    )
  }

}
