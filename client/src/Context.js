import React, { Component } from 'react';
import Data from './Data';
//https://github.com/js-cookie/js-cookie
import Cookies from 'js-cookie';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null
  };

  constructor() {
    super();
    this.data = new Data();
  }

  render() {

    const { authenticatedUser } = this.state; // Getting authenticated user from state

    const value = {
      authenticatedUser,
      data: this.data,
      actions: { 
        signIn: this.signIn,
        signOut: this.signOut
      },
    };

    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  // Signs user in and makes sure that it isnt an empty or false user before setting it to global user and saving this to Cookies
  signIn = async (username, password) => {
    const user = await this.data.getUser(username, password);
    if (user !== null && user !== 401) 
    {
      this.setState(() => {
        return {
          authenticatedUser: user,
        }
      });
      // Setting cookie
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
    }
    return user;
  }

  signOut = () => {
    this.setState({ authenticatedUser: null });
    Cookies.remove('authenticatedUser');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

