import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Public from './components/Public';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import Authenticated from './components/Authenticated';
import PrivateRoute from './PrivateRoute';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';

 // New import
 import withContext from './Context'; // This is what we're going to use to make sure values are available throughout the app
 
 const HeaderWithContext = withContext(Header);
 const UserSignUpWithContext = withContext(UserSignUp); // without having to send through props
 const UserSignInWithContext = withContext(UserSignIn);
 const AuthWithContext = withContext(Authenticated);
 const UserSignOutWithContext = withContext(UserSignOut);

/*
When React renders a component that subscribes to context, it will read the context value passed to it from its Provider.
In context, I first added a value object to the provider and now that value will be shared through Context (its a wrapper!)
*/
export default () => (
  <Router>
    <div>
      <HeaderWithContext />

      <Switch>
        <Route exact path="/" component={Public} />
        <PrivateRoute path="/authenticated" component={AuthWithContext} />
        <PrivateRoute exact path="/courses" component={Courses} />
        <PrivateRoute path="/courses/:id" component={CourseDetail} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);
