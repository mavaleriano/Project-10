/* Stateful class component
   This component provides the "Create Course" screen by rendering a form that allows a 
   user to create a new course. The component also renders a "Create Course" button 
   that when clicked sends a POST request to the REST API's /api/courses route. This 
   component also renders a "Cancel" button that returns the user to the default route 
   (i.e. the list of courses).
*/

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class CreateCourse extends Component {
  
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: '',
    newError: false,
  }

  // On mount, sets the user information which is used later on to sync that user info to the course
  componentDidMount(){
    const { context } = this.props;

    this.setState({
      firstName: context.authenticatedUser.firstName,
      lastName: context.authenticatedUser.lastName,
      emailAddress: context.authenticatedUser.email,
      password: context.authenticatedUser.password
    });
  }

  // Prints out the validation errors
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

  // Redirects upon cancel
  handleSubmit (e) {
    e.preventDefault();
    return (
      <Redirect to="/courses" />
    );
  }

  render(){
    const {
      firstName,
      lastName,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;

    return(
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <div>
          {this.state.newError ? errors : null}
          <form onSubmit={this.submit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={title} onChange={this.change} /></div>
                <p>By {firstName} {lastName}</p>
              </div>
              <div className="course--description">
                <div><textarea id="description" name="description" className="" placeholder="Course description..." value={description} onChange={this.change}></textarea></div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={estimatedTime} onChange={this.change} /></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials... each material separated by new line" value={materialsNeeded} onChange={this.change}></textarea></div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Create Course</button><button className="button button-secondary" onClick={this.handleSubmit}>Cancel</button></div>
          </form>
        </div>
      </div>
    );
  }

  // Handles the changing state values of the inputs in the render
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

    context.data.createCourse(user, course)
      .then( errors => {
        if (errors.length)
        {
          let returnedErrors = this.ErrorsDisplay(errors);
          this.setState({ errors: returnedErrors, newError: true });
        }
        else
        {
          console.log('Course created!');
          this.setState({ newError: false });
          this.props.history.push('/courses');
        }
      })
      .catch( err => {
        console.log(err.name);
        this.props.history.push('/error');
      })
  }
}