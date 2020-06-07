import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignUp extends Component {
  state = {
    fName: '',
    lName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: [],
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text"
                  value={firstName || ''} 
                  onChange={this.change} 
                  placeholder="First Name" />
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text"
                  value={lastName || ''} //https://stackoverflow.com/questions/47012169/a-component-is-changing-an-uncontrolled-input-of-type-text-to-be-controlled-erro
                  onChange={this.change} 
                  placeholder="Last Name" />
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={emailAddress} 
                  onChange={this.change} 
                  placeholder="Email address" />
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />
                <input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword} 
                  onChange={this.change} 
                  placeholder="Confirm Password" />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
        </div>
      </div>
    );
  }

  // Changing state to re-render form
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  // Handles submitting new user
  submit = () => {
    const { context } = this.props;

    const {
      firstName,
      lastName,
      emailAddress, //changing this
      password,
      confirmPassword,
    } = this.state;

    const user = {
      firstName, // same as name: name
      lastName,
      emailAddress, //changed this too
      password,
      confirmPassword,
    };

    context.data.createUser(user) // Using the API utilities from context.data to createUser, in Data.js.
      .then( errors => {          // Checks to see if there are errors
        if (errors.length)
        {
          this.setState({ errors }); // If there are errors, sets them to state
        }
        else
        {
          context.actions.signIn(emailAddress, password) // changed this from emailAddress -> emailAddress
            .then(() => {
              this.props.history.push('/courses');
            });
        }
      })
      .catch( err => { // Handles rejected promises
        console.log(err)
        this.props.history.push('/error'); // push to history stack
      })
  }

  cancel = () => {
    this.props.history.push('/courses');
  }
}
