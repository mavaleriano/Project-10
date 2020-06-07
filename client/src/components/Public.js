import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Courses extends Component {
  render() {
    return (
      <Redirect to="/courses" />
      // <div className="bounds">
      //   <div className="grid-100">
      //     <h1>Welcome to the Main Page</h1>
      //   </div>
      // </div>
    );
  }
}
