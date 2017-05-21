import React from "react";

import {Panel, Accordion} from "react-bootstrap";

export default class EventPanel extends React.Component {

    dateToTime(dateString) {
        let a;
        if (typeof dateString === "string") {
            a = /T(\w+:\w+)/.exec(dateString);
        }
        if (a[1].startsWith("0")) { a[1] = a[1].slice(1); }

        return a[1];
    }

    placePanel = (e) => {
        const headerString = (
          <div style={{fontSize: "12px"}}>
            <h4>{e.name}</h4>
            <p>{`${e.dow}: ${this.dateToTime(e.start_time)}-${this.dateToTime(e.end_time)}`}</p>
          </div>
        );

        const panel = (
      <Panel key={e.id}
             header={headerString}
             eventKey={e.id}>
        {`Has Food: ${e.has_food} | Has Drink: ${e.has_drink}`}
      </Panel>
    );

        return panel;
    }

    placeList = () => {
        let places = (this.props.data.length) ? this.props.data : JSON.parse(this.props.all);
        let allEvents = [];

        if (this.props.allEvents) {
          allEvents = this.props.allEvents;
        } else {
          places.forEach(place => {
            place.events.forEach(event => {
              allEvents.push(event);
            })
          });
        }

        let list = allEvents.map(event => {
          return this.placePanel(event);
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
