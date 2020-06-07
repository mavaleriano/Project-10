/* Stateful class component
   This component provides the "Sign In" screen by rendering a form that allows a user to 
   sign using their existing account information. The component also renders a "Sign In" 
   button that when clicked signs in the user and a "Cancel" button that returns the user 
   to the default route (i.e. the list of courses)
*/

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignIn extends Component {
  state = {
    username: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      username,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <input 
                  id="username" 
                  name="username" 
                  type="text"
                  value={username} 
                  onChange={this.change} 
                  placeholder="User Name" />
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />                
              </React.Fragment>
            )} />
          <p>
            Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
          </p>
        </div>
      </div>
    );
  }

  // Updates state as you change the input fields above in the rendering. Gets the input field (name) and then sets state of it
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  // Gathers the information from form field to sign user in, if unsuccessful shows validation errors, otherwise, directs you automatically to /courses
  submit = (e) => {
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/courses'} };
    const {username, password } = this.state;
    context.actions.signIn(username, password)
      .then( user => {
        if (user === null || user === 401) 
        {
          this.setState(() => {
            return { errors: [ 'Sign-in was unsuccessful' ]};
          });
        }
        else
        {
          this.props.history.push(from);
        }
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error');
      })
  }

  cancel = () => {
    this.props.history.push('/');
  }
}
