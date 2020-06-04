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
//import { Link } from 'react-router-dom';

class CourseDetail extends Component {
   constructor() {
      super();
      this.data = new Data();

      this.state = {
        Course: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        path: '',
        is_Mounted: false
        //errors: []
      };
   }

   // Calling this.getCourses to load the updated API courses
   componentDidMount(){
     const { location } = this.props;
     let path = location.pathname;
     this.getCourse(path);
     this.setState({
        path,
        is_Mounted: true
     });
   }

   // Retrieves the courses and sets this to state
   getCourse = async (path) => {
      const course = await this.data.getCourse(path);
      this.setState({
         Course: course,
         firstName: course.User.firstName,
         lastName: course.User.lastName,
         emailAddress: course.User.emailAddress
      });
      console.log(course); //LOGGGGGGGGGGGGGGGGGGGGGGGing
   }

   deleteCourse = async (e) => {
      e.preventDefault();
      if(window.confirm("Are you sure you want to delete this course? There is no going back!"))
      {
         console.log('Course deleted!');
      }
   }

   /*
      Suggestion to use try catch: https://stackoverflow.com/questions/50180344/unexpected-token-u-in-json-at-position-0-but-only-sometimes/50180478#:~:text=That%20unexpected%20%22u%22%20is%20the,that%20isn't%20loaded%20yet.
      It might seem funny.. but finalizing this one function took me like.. 5 hrs. I really wanted to make it work
      -At first I thought I needed to use JSON.stringify and then I tried using jsonata
   */
   formatJSON = (data) => {
      try{
         let regex = /\n\n/igm; //Sets the regular expression for finding the \n\n in the text
         let newData = data.replace(regex, '</p><p>'); // Replaces those \n\n with p
         let finalData = '<p>'+newData+'</p>'; // Adds opening and closing p tags
         return finalData;
      }
      catch (error)
      {
         return null;
      }
   }

   render(){
      let Path = `${this.state.path}/update`;
      let name = `${this.state.firstName} ${this.state.lastName}`;
      let desc;
      if(this.state.is_Mounted)
      {
         desc = this.formatJSON(this.state.Course.description);
      }

      return(
         <div>
            <div className="actions--bar">
               <div className="bounds">
                  <div className="grid-100"><span><a className="button" href={Path}>Update Course</a><a className="button" href={this.state.path} onClick={this.deleteCourse}>Delete Course</a></span><a
                  className="button button-secondary" href="/">Return to List</a>
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
                     <div dangerouslySetInnerHTML={{ __html: desc }} />
                  </div>
               </div>
               <div className="grid-25 grid-right">
                  <div className="course--stats">
                     <ul className="course--stats--list">
                        <li className="course--stats--list--item">
                           <h4>Estimated Time</h4>
                           <h3>{this.state.Course.estimatedTime ? this.state.Course.estimatedTime
                           : "Unavailable"}</h3>
                        </li>
                        <li className="course--stats-list--item">
                           <h4>Materials Needed</h4>
                           <ul>
                              {/* {this.state.Course.materialsNeeded ? } */}
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