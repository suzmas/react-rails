import React, { PropTypes } from "react";

import {Panel, Accordion} from "react-bootstrap";

export default class PlacePanel extends React.Component {

    dateToTime(dateString) {
        let a;
        if (typeof dateString === "string") {
            a = /T(\w+:\w+)/.exec(dateString);
        }
        if (a[1].startsWith("0")) { a[1] = a[1].slice(1); }

        return a[1];
    }

    eventString = (events) => {
        let stringArray = events.map(event => {
            const start_time = this.dateToTime(event.start_time);
            const end_time = this.dateToTime(event.end_time);

            return (
        `${event.dow}: ${start_time}-${end_time}`
            );
        });

        return stringArray.join(", ");
    }

    placePanel = (place, events) => {
        const headerString = (
          <div style={{fontSize: "12px"}}>
            <h4>{place.name}</h4>
            <p>{place.address1}</p>
          </div>
        );

        const panel = (
      <Panel key={place.id}
             header={headerString}
             eventKey={place.id}>
        {this.eventString(events)}
      </Panel>
    );

        return panel;
    }

    placeList = () => {
        let places = (this.props.data.length) ? this.props.data : JSON.parse(this.props.all);

        let list = places.map(place => {
          return this.placePanel(place.place, place.events);
        });

        return list;
    }

    handleSelect = (e,k) => {
      this.props.onSelectChange(e);
    }

    handleExit = (e,k) => {
      console.log("exit");
    }

    render() {
        return (
      <Accordion onSelect={this.handleSelect}>
        {this.placeList()}
      </Accordion>
        );
    }
}
