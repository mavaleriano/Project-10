import React from 'react';
import { Redirect } from 'react-router-dom';

export default ({ context }) => {
  context.actions.signOut();
  
  return (
    <Redirect to="/" />
  );
}
/* Getting Cannot update during an existing state transition:
in Unknown (at Context.js:73)
    in ContextComponent (created by Context.Consumer)
    in Route (at App.js:41)
    in Switch (at App.js:35)
    in div (at App.js:32)
    in Router (created by BrowserRouter)
    in BrowserRouter (at App.js:31)
    in Unknown (at src/index.js:11)
    in Provider (at src/index.js:10)
*/