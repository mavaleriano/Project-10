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
        is_Mounted: false
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
        is_Mounted: true
     }, () => this.getCourse(path));
   }

   // Retrieves the courses and sets this to state
   getCourse = async (path) => {
      const course = await this.data.getCourse(path);
      this.setState({
         Course: course,
         id: course.id,
         firstName: course.User.firstName,
         lastName: course.User.lastName,
         emailAddress: course.User.emailAddress
      }, () => this.verifyUser());
      console.log(course); //LOGGGGGGGGGGGGGGGGGGGGGGGing
   }

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
      }
   }

   verifyUser () {
      console.log(this.state.authUser + " OR " + this.state.emailAddress);
      if(this.state.authUser === this.state.emailAddress)
      {
         this.setState({verified: true});
      }
   }
   /*
      Suggestion to use try catch: https://stackoverflow.com/questions/50180344/unexpected-token-u-in-json-at-position-0-but-only-sometimes/50180478#:~:text=That%20unexpected%20%22u%22%20is%20the,that%20isn't%20loaded%20yet.
      It might seem funny.. but finalizing this one function took me like.. 5 hrs. I really wanted to make it work
      -At first I thought I needed to use JSON.stringify and then I tried using jsonata
   
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
   }*/

   // Returns list of materials: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
   // materialsList(mat) {
   //    try {
   //       let regex = /\n/igm; //Sets the regular expression for finding the \n\n in the text
   //       let regexx = /\*/igm
   //       mat = mat.replace(regexx, '');
   //       const matList = mat.replace(regex, '</li><li>');
   //       let finalListt = '<li>'+matList+'</li>' // Had to add this because an extra li tag showed so added </li> to differentiate it from the rest
   //       let finalList = finalListt.replace('<li></li>', '');
         
   //       console.log(matList);
   //       return finalList;
   //    }
   //    catch (error)
   //    {
   //       return null;
   //    }
   // }

   render(){
      let Path = `${this.state.path}/update`;
      let name = `${this.state.firstName} ${this.state.lastName}`;
      // let desc;
      // let materials;
      // if(this.state.is_Mounted)
      // {
      //    desc = this.formatJSON(this.state.Course.description);
      //    materials = this.materialsList(this.state.Course.materialsNeeded);
      // }

      // if(this.state.is_Mounted)
      // {
      //    let verified = this.verifyUser();
      // }

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
                     {/* <div dangerouslySetInnerHTML={{ __html: desc }} /> */}
                     <ReactMarkdown source={this.state.Course.description} />
                  </div>
               </div>
               <div className="grid-25 grid-right">
                  <div className="course--stats">
                     <ul className="course--stats--list">
                        <li className="course--stats--list--item">
                           <h4>Estimated Time</h4>
                           <h3>{this.state.Course.estimatedTime ? this.state.Course.estimatedTime
                           : "No specified time"}</h3>
                        </li>
                        <li className="course--stats-list--item">
                           <h4>Materials Needed</h4>
                           <ul>
                              {/* {materials ? <div dangerouslySetInnerHTML={{ __html: materials }} />
                              : "None required"} */}
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