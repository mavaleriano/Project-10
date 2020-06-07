/* Stateful class component
   This component provides the "Courses" screen by retrieving the list of courses 
   from the REST API's /api/courses route and rendering a list of courses. Each 
   course needs to link to its respective "Course Detail" screen. This component 
   also renders a link to the "Create Course" screen.
*/

import React, { Component } from 'react';
import Data from '../Data';
import { withRouter } from 'react-router-dom';

class Courses extends Component {
   constructor() {
      super();
      this.data = new Data();

      this.state = {
        Courses: [],
      };
   }

   // Calling this.getCourses to load the courses directly from API
   componentDidMount(){
      this.getCourses();
   }

   // Retrieves the courses and sets this to state, if no courses returned then redirects to /notfound
   getCourses = async () => {
      try{
         const courses = await this.data.getCourses();
         this.setState({
            Courses: courses
         });
      }
      catch(error) {
         console.log(error);
         this.props.history.push('/notfound');
      }
   }

   // Returns each block for the dynamic courses
   courseBlock(course) {
      let path = `/courses/${course.id}`;
      let id = course.id;

      return <div className="grid-33" key={id}><a className="course--module course--link" href={path}>
      <h4 className="course--label">Course</h4>
      <h3 className="course--title">{course.title}</h3>
      </a></div>;
   }

   render(){
      //Used this for idea of using map to render the multiple courses: https://www.storyblok.com/tp/react-dynamic-component-from-json
      return(
         <div className="bounds">
            {this.state.Courses.map(course => this.courseBlock(course))}
            <div className="grid-33"><a className="course--module course--add-module" href="/courses/create">
               <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                  viewBox="0 0 13 13" className="add">
                  <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
               </svg>New Course</h3>
            </a></div>
         </div>
      );
   }
}

export default withRouter(Courses);