import React, { Component } from 'react';
import $ from 'jquery';
import EventList from './EventList';
import Nav from './Nav';
import MapComponent from './MapComponent';
import SearchForm from './SearchForm';
import { default as canUseDOM } from "can-use-dom";


export default class EventsPage extends Component {

  constructor(props) {
    super(props);
    if (props.events.length) { //if the ajax call completes before moving to this page
      var randomEvent = this.getRandomEvent(props.events); 
      this.state = {selectedEventIDs: [randomEvent.id], radius: 2};
    } else {
        this.state = {selectedEventIDs: [], radius: 2}
      }
  }

  componentWillReceiveProps(newProps) {
    //set random event
    console.log("PROPS RECIEVING");
    //debugger;
    var randomEvent = this.getRandomEvent(newProps.events);
    this.setState({ selectedEventIDs: [randomEvent.id] });
  };

  handleMapMarkerClick(marker) {
    this.setState((previousState) => {
      var eventIdIndex = previousState.selectedEventIDs.indexOf(marker.id);
      if (eventIdIndex > -1) {
        previousState.selectedEventIDs.splice(eventIdIndex, 1);
      }
      return {selectedEventIDs: [marker.id, ...previousState.selectedEventIDs]}
    });
  }

  getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomEvent(events_array) {
    return events_array[this.getRandomIntInclusive(0, this.props.events.length - 1)];
  }

  handleChangeInRadius(newRadius = 2) {
    console.log("new radius:");
    console.log(newRadius); //want to pass this as a prop to mapcomponent
    this.setState({radius: newRadius});
  }

  render() {
    return (
      <div>
        <Nav />
        <div className="columns">
          <div className="column is-one-third space_edit">
            <SearchForm showButton={false} handleChangeInRadius={this.handleChangeInRadius.bind(this)}/>
            <EventList
              events={this.props.events}
              selectedEventIDs={this.state.selectedEventIDs}
            />
          </div>
          <div className='column is-two-thirds container-map' style={{height: "100%"}}>
            <MapComponent
              selectedEventIDs={this.state.selectedEventIDs}
              events={this.props.events}
              onMapMarkerClick={this.handleMapMarkerClick.bind(this)}
              defaultCenter={this.props.currentPosition}
              radius={this.state.radius}
            />
          </div>
        </div>
      </div>
    );
  }

}