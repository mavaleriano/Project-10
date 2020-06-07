/* Stateful class component
   This component provides the "Course Detail" screen by retrieving the detail 
   for a course from the REST API's /api/courses/:id route and rendering the 
   course. The component also renders a "Delete Course" button that when clicked 
   should send a DELETE request to the REST API's /api/courses/:id route in order 
   to delete a course. This component also renders an "Update Course" button for 
   navigating to the "Update Course" screen.
*/

import React, { Component } from 'react';
import Data from '../Data';
import { withRouter } from 'react-router-dom';
const ReactMarkdown = require('react-markdown');

class CourseDetail extends Component {
   constructor() {
      super();
      this.data = new Data();

      this.state = {
        id: null,
        Course: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        path: '',
        authUser: '',
        verified: false,
      };
   }

   // Calling this.getCourses to load the updated API courses
   componentDidMount(){
     const { location } = this.props;
     const { context } = this.props;
     let path = location.pathname;
     
     this.setState({
        password: (context.authenticatedUser ? context.authenticatedUser.password : null),
        authUser: (context.authenticatedUser ? context.authenticatedUser.email : null),
        path,
     }, () => this.getCourse(path));
   }

   // Retrieves the courses and sets this to state along with needed variables, else redirects to /notfound
   getCourse = async (path) => {
      try {
         const course = await this.data.getCourse(path);
         this.setState({
            Course: course,
            id: course.id,
            firstName: course.User.firstName,
            lastName: course.User.lastName,
            emailAddress: course.User.emailAddress
         }, () => this.verifyUser()); //Making sure to call here so that this function only runs once needed variables have been correctly set to verify userId and authUser match
      }
      catch(error)
      {
         this.props.history.push('/notfound');
      }
   }
   
   // Erases a course: first asks for confirmation to make sure user is sure then redirects depending on returned response
   deleteCourse = async (e) => {
      e.preventDefault();
      if(window.confirm("Are you sure you want to delete this course? There is no going back!"))
      {
         const toErase = await this.data.destroyCourse(this.state.emailAddress, this.state.password, this.state.path);
         if(toErase === 204)
         {
            console.log('Course deleted!');
            this.props.history.push('/courses');
         }
         else
         {
            console.log(toErase);
            this.props.history.push('/error');
         }
      }
   }

   // Checks to make sure that the authenticatedUser (user that is logged in) is the same as the author of the course: Helps in rendering of update/delete button
   verifyUser () {
      if(this.state.authUser === this.state.emailAddress)
      {
         this.setState({verified: true});
      }
   }

   // Using ReactMarkdown to display certain values, as requested for project requirements
   render(){
      let Path = `${this.state.path}/update`; //Sets correct path for edit redirect
      let name = `${this.state.firstName} ${this.state.lastName}`; // Just easier to type {name}

      return(
         <div>
            <div className="actions--bar">
               <div className="bounds">
                  <div className="grid-100">{this.state.verified ? <span><a className="button" href={Path}>Update Course</a><a className="button" href={this.state.path} onClick={this.deleteCourse}>Delete Course</a></span> : null}<a
                  className="button button-secondary" href="/courses">Return to List</a>
                  </div>
               </div>
            </div>
            <div className="bounds course--detaial">
               <div className="grid-66">
                  <div className="course--header">
                     <h4 className="course--label">Course</h4>
                     <h3 className="course--title">{this.state.Course.title}</h3>
                     <p>By {name}</p>
                  </div>
                  <div className="course--description">
                     <ReactMarkdown source={this.state.Course.description} />
                  </div>
               </div>
               <div className="grid-25 grid-right">
                  <div className="course--stats">
                     <ul className="course--stats--list">
                        <li className="course--stats--list--item">
                           <h4>Estimated Time</h4>
                           <h3>{this.state.Course.estimatedTime ? this.state.Course.estimatedTime
                           : <ReactMarkdown source="_No specified time_" />} </h3>
                        </li>
                        <li className="course--stats-list--item">
                           <h4>Materials Needed</h4>
                           <ul>
                              <ReactMarkdown source={this.state.Course.materialsNeeded} />
                           </ul>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

export default withRouter(CourseDetail);