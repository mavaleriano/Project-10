import React, { Component } from 'react';
import Data from '../Data';
import { withRouter } from 'react-router-dom';

class UpdateCourse extends Component {
  constructor() {
    super();
    this.data = new Data();

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      id: '',
      Course: '',
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      path: '',
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
      newError: false,
      errors: ''
    };
 }

 // Calling this.getCourses to load the updated API courses
 componentDidMount(){
   const { location } = this.props;
   const { context } = this.props;
   let path = location.pathname;
   this.getCourse(path);
   this.setState({
       password: (context.authenticatedUser ? context.authenticatedUser.password : null),
      path,
   });
 }

 // Retrieves the courses and sets this to state
 getCourse = async (path) => {
  let regex = /\/courses\/\d+/i;
  let actualPath = path.match(regex);

  try{
    const course = await this.data.getCourse(actualPath);
    this.setState({
       Course: course,
       id: course.id,
       firstName: course.User.firstName,
       lastName: course.User.lastName,
       emailAddress: course.User.emailAddress,
       title: course.title,
       description: course.description,
       estimatedTime: course.estimatedTime,
       materialsNeeded: course.materialsNeeded,
       path: actualPath
    });
    console.log(course); //LOGGGGGGGGGGGGGGGGGGGGGGGing
  }
  catch(error){
    console.log(error);
  }
 }

 ErrorsDisplay( errors ) {
  let errorsDisplay = null;
  
  if (errors !== undefined && errors.length) {
    errorsDisplay = (
      <div>
        <h2 className="validation--errors--label">Validation errors</h2>
        <div className="validation-errors">
          <ul>
            {errors.map((error, i) => <li key={i} className="a">{error}</li>)}
          </ul>
        </div>
      </div>
    );
  }
  return errorsDisplay;
}

handleSubmit (e) {
  e.preventDefault();
  let path = this.state.id;
  this.props.history.push('/courses/'+path);
}

  render(){
    const {
      firstName,
      lastName,
      errors
    } = this.state;
    //console.log(this.state.Course.description);
    return(
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          {this.state.newError ? errors : null}
          <form onSubmit={this.submit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div><input id="title" name="title" className="input-title course--title--input" placeholder="Course title..." value={this.state.title || ''} onChange={this.change} /></div>
                <p>By {firstName} {lastName}</p>
              </div>
              <div className="course--description">
                <div><textarea id="description" name="description" className="" placeholder="Course description..." value={this.state.description || ''} onChange={this.change}></textarea></div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time-input" placeholder="Hours" value={this.state.estimatedTime || ""} onChange={this.change} /></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={this.state.materialsNeeded} onChange={this.change}></textarea></div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Update Course</button><button className="button button-secondary" onClick={this.handleSubmit}>Cancel</button></div>
          </form>
        </div>
      </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = (event) => {
    const { context } = this.props;
    event.preventDefault();
    let path = `/courses/${this.state.id}`;
    //Destructuring required values from state
    const {
      emailAddress,
      password,
      title,
      description,
      estimatedTime,
      materialsNeeded
    } = this.state;

    const user = {
      username: emailAddress,
      password
    };
    
    const course = {
      title,
      description,
      estimatedTime,
      materialsNeeded
    };

    context.data.updateCourse(user, course, path)
      .then( errors => {
        if (errors.length)
        {
          let returnedErrors = this.ErrorsDisplay(errors);
          this.setState({ errors: returnedErrors, newError: true });
        }
        else
        {
          console.log('Course updated!');
          this.setState({ newError: false });

          this.props.history.push('/courses/' + this.state.id);
        }
      })
      .catch( err => {
        console.log(err.name);
      })
    console.log("Submitted! --Past!");
  }
}


export default withRouter(UpdateCourse);