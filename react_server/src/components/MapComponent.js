import React, { Component } from 'react';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow, Circle} from "react-google-maps";
import Filters from "./Filters";
import $ from 'jquery';


export default class GoogleMapContent extends Component {

// DONE : stripped html tags from description
//TO DO : add whitespace in place of removed html tags

  constructor(props) {
    super(props);
    this.state = {
      previousMarker: null,
      filteredCategories: [],
      radiusOfMarkers: 2,
      markerIdToBounce: null
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.radius != this.state.radiusOfMarkers){
      this.setState({radiusOfMarkers: newProps.radius, markerIdToBounce: null})  //continue from here. 
    } 
    else {
      if(this.props.selectedEventIDs === newProps.selectedEventIDs){  //if it was an event card mousedOver
        console.log("this is componenet will reciveve in map and ");
        this.setState({markerIdToBounce: newProps.eventIdMousedOver});
      } else {
        this.setState({markerIdToBounce: null});
      }
    }

  }

  handleFilterClick(category) {
    this.setState(function(previousState) {
      var newFilterSet;

      if (previousState.filteredCategories.includes(category)) { //taking away category
        newFilterSet = previousState.filteredCategories.filter(function(filterCategory) {
          return filterCategory != category;
        });
      }
      else { //adding category
        newFilterSet = [...previousState.filteredCategories, category];
      }
      return {filteredCategories: newFilterSet};
    });
  }

  onMarkerClick(marker) {
    if (!marker.showInfo) {
      console.log(marker);
      this.props.onMapMarkerClick(marker);
      marker.showInfo = true;
      if (this.state.previousMarker && this.state.previousMarker != marker){ 
        this.state.previousMarker.showInfo = false;
      }
      this.setState({previousMarker: marker});
    } else {
      marker.showInfo = false;
    }
    this.setState(this.state);
  };

  getAnimation(marker) {
    if(marker.id === this.state.markerIdToBounce){
      return 4;
    }
  }

  renderInfoWindow(marker) {
    return (
      <InfoWindow onCloseclick={() => this.onMarkerClick(marker)} > 
        <div style={{width: "500px", maxHeight: "100px"}}>
          <strong>{marker.title}</strong>
          <p>{marker.description ? $('<div>' + marker.description + '</div>').text() : "No description."}</p>
        </div> 
      </InfoWindow>
      
    );
    
  };

  render() {

    if (this.props.events) {  
      return (
          <div>
            <GoogleMapLoader
              containerElement={
                <div
                  //{...this.props}
                  style={{
                    height: "100%",
                  }} > 
                </div>
              }
              googleMapElement={
                <GoogleMap
                  ref='map'
                  defaultZoom={13}
                  defaultCenter={this.props.defaultCenter}
                >
                <Filters onFilterClick={this.handleFilterClick.bind(this)}/>
                {this.props.events.map((marker, index) => {  //this.state.markers.map
                  if (this.state.filteredCategories.length == 0 /* && distanceBetween(this.props.defaultCenter, marker.) <= this.state.radiusOfMarkers */|| this.state.filteredCategories.includes(marker.categories.category[0].id) || this.props.selectedEventIDs.includes(marker.id)) {
                    return (
                      <Marker
                        key={index}
                        position={{lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) } } //marker.position
                        title={ marker.title }//marker.title
                        onClick={() => this.onMarkerClick(marker)} 
                        animation={this.getAnimation(marker)}
                        //icon={"https://lh4.ggpht.com/Tr5sntMif9qOPrKV_UVl7K8A_V3xQDgA7Sw_qweLUFlg76d_vGFA7q1xIKZ6IcmeGqg=w300"}
                        //visible={false}
                        // onMouseover={() => this.onMarkerClick(marker) }
                        // onMouseleave={() => this.handleMarkerLeave(marker) }
                      > 

                        { marker.showInfo ? this.renderInfoWindow(marker) : null }

                      </Marker>
                    );
                  }
                })
              }

              </GoogleMap>
              }
            />
          </div>);
    }
    return (<h2> <br/><br/>Loading... </h2>)
  }

};
