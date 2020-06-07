import config from './config';

export default class Data {
  // Handles all requests and adds the optional authentication
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
      console.log(options.body);
    }

    // Checking if auth is required
    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);

      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  // Gets the list of courses and turns appropriate response
  async getCourses() {
    const response = await this.api(`/courses`, 'GET', null, false, null);
    if (response.status === 200) { //Successful
      return response.json().then(data => data);
    }
    else if (response.status === 401) { //
      return response.status;
    }
    else {
      return 500;
    }
  }

  // GET request to retrieve a single course
  async getCourse(path) {
    try {
      const response = await this.api(path, 'GET', null, false, null);
      if (response.status === 200) {
        return response.json().then(data => data);
      }
      else if (response.status === 401) {
        return null;
      }
      else {
        throw new Error();
      }
    }
    catch(error) {
      console.log(error);
      return error;
    }
  }

  // Sends GET request to get user in order to be able to authenticate
  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, {username, password});
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return response.status;
    }
    else {
      throw new Error();
    }
  }
  
  // Sends request to sign up new user
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      console.log('This worked!');
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        console.log(data.message);
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  // Sends POST request to create new course or returns validation/authentication errors
  async createCourse(user, course) {
    let username = user.username;
    let password = user.password;
    
    const response = await this.api('/courses', 'POST', course, true, {username, password});
    if (response.status === 201) {
      console.log('This worked!');

      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  // Sends PUT request to change existing course and returns status to response appropriately
  async updateCourse(user, course, path) {
    let username = user.username;
    let password = user.password;
    
    const response = await this.api(path, 'PUT', course, true, {username, password});
    if (response.status === 204) {
      console.log('This worked!');

      return [];
    }
    else if (response.status === 403) { //authentication error
      return response.json().then(data => {
        window.alert(data.message);
        return data;
      });
    }
    else if (response.status === 400) { //validation error
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      return response.json().then(data => {
        return data.errors;
      });
    }
  }

  // Deletes the course at the provided path after authenticating the correct user
  async destroyCourse(username, password, path){
    const response = await this.api(path, 'DELETE', null, true, {username, password});
    console.log(response.status);
    if (response.status === 204) {
      return response.status;
    }
    else if (response.status === 403)
    {
      return response.json().then(data => {
        window.alert(data.message);
        return data.errors;
      });
    }
    else {
      return response.status;
    }
  }
}
