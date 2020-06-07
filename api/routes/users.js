'use strict';

const express = require('express');
// Constructing router instance
const router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require("../models").User;
const { check, validationResult } = require('express-validator/check');


/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error)
    {
      next(error);
    }
  }
}

// Middleware to for user authentication
const authenticateUser = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user via email by user's "key" from Authorization header
    // by their username (i.e. the user's "key"
    const user = await User.findOne( {where: {emailAddress: credentials.name} });

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) 
      {
        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } 
      else 
      {
        message = `Authentication failurer for username: ${user.username}`;
      }
    } 
    else 
    {
        message = `User not found for username: ${credentials.name}`;
    }
  }
  else {
    message = `Auth header not found`;
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};

// Getting current authenticated user
// First runs authenticateUser middleware before responding with json formatted data that avoids returning password, createdAt and updatedAt
router.get('/users', authenticateUser, (req, res) => {
  const user = req.currentUser;
  
  res.json({
    userId: `${user.userId}`,
    firstName: `${user.firstName}`, 
    lastName: `${user.lastName}`,
    email: `${user.emailAddress}`,
    password: `${user.password}`,
  });
});

// Creates a user, sets the Location header to "/" and returns no content
// If there are errors, it returns those errors
router.post('/users', [
  check('firstName')
    .exists()
    .withMessage('"First Name" is needed'),
  check('lastName')
    .exists()
    .withMessage('"Last Name" is needed'),
  check('emailAddress')
    .not().isEmpty()
    .withMessage('"Email address" is needed')
    .if(check('emailAddress').not().isEmpty())
    .isEmail().normalizeEmail()
    .withMessage('Make sure to include a valid email address'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true }) //https://stackoverflow.com/questions/50252953/express-validator-does-not-catches-errors
    .withMessage('Password value is needed')
    .if(check('password').exists({ checkNull: true, checkFalsy: true }))
    .isLength({ min: 8, max: 20})
    .withMessage('Please, be sure to provide a value for "password" that is between 8 and 20 characters in length'),
  check('confirmPassword') // https://github.com/treehouse-projects/rest-api-validation-with-express/blob/master/completed-files/routes.js: 120-132
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please confirm your password')
    .custom((value, {req}) => { // If I don't leave value, I get error "Cannot read property 'body' of undefined"
    // Only attempt to compare the `password` and `passwordConfirmation`
    // fields if they have values.

    if (req.body.password && req.body.confirmPassword && req.body.password !== req.body.confirmPassword) {
      throw new Error('Please provide values for "password" and password confirmation" that match');
    }

    // Return `true` so the default "Invalid value" error message
    // doesn't get returned
    return true;
  }),
], asyncHandler(async (req,res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  }
  else {
    let user;
    try{
      const tempUser = await User.findOne( {where: {emailAddress: req.body.emailAddress} });
      if (tempUser)
      {
        const errorMessages = ["emailAddress value has already been used"];
        res.status(400).json({ errors: errorMessages });
      }
      else
      {
        req.body.password = await bcryptjs.hash(req.body.password, 10);
        user = await User.create(req.body);
        
        // https://expressjs.com/en/api.html#res <-- How to set location header
        res.status(201).location('/').end();
      }
    }
    catch (error)
    {
      res.status(500).json({ errorName: error.name });
    }
  }
}));

// Created this just to get rid of excess users being created for testing

router.delete('/users', asyncHandler(async (req, res) => {
  let user;
  user = await User.findOne({ where: { emailAddress: req.body.emailAddress } });
  await user.destroy();
  res.status(204).end();
}));


module.exports = router;