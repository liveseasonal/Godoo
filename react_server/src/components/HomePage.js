import React, { Component } from 'react';
import Hero from './Hero';
import InfoSection from './InfoSection';

export default class HomePage extends Component {

  render() {
    return(
      <div>
        <Hero />
        <InfoSection />
        Hi there
      </div>
    );
  }

}