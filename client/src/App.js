import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Component } from 'react';

class App extends Component {
  constructor() {
    super()
  }
  componentWillMount() {
    this.getData()
  }

  async getData() {
    const response =
      await fetch("http://localhost:5000/api/courses",
        { headers: {'Content-Type': 'application/json'}}
      )
    console.log(await response.json())
  }

  render(){
    return (
      <div>
        <p>Hello World</p>
      </div>
    )
  }
}



export default App;
