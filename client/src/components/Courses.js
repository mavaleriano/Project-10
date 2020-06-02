/* Stateful class component
   This component provides the "Courses" screen by retrieving the list of courses 
   from the REST API's /api/courses route and rendering a list of courses. Each 
   course needs to link to its respective "Course Detail" screen. This component 
   also renders a link to the "Create Course" screen.
*/

import React, { Component } from 'react';
//import { Link } from 'react-router-dom';

export default class UserSignUp extends Component {
   state = {}

   render(){
      return(
         <h1>Hello World!</h1>
      );
   }
}