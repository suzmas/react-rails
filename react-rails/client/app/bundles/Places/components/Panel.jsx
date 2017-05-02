import React from "react";
import {Panel, Accordion} from "react-bootstrap";

export default class Item extends React.Component {

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
        let panel = (
      <Panel key={place.id} header={place.name} eventKey={place.id}>
        {this.eventString(events)}
      </Panel>
    );

        return panel;
    }

    placeList = () => {
        let places = this.props.all;
        places = JSON.parse(places);

        let list =
      places.map(place => { return this.placePanel(place.place, place.events);
      });

        return list;
    }

    render() {
        return (
      <Accordion style={{ maxWidth: "500px" }}>
        {this.placeList()}
      </Accordion>
        );
    }
}
