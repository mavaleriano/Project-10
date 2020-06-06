import config from './config';

export default class Data {
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
    console.log(options);
    return fetch(url, options);
  }

  async getCourses() {
    const response = await this.api(`/courses`, 'GET', null, false, null);
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

  async getCourse(path) {
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

  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, {username, password});
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
  
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      console.log('This worked!');
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        console.log(data.errors);
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

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
        console.log(data.errors);
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  async updateCourse(user, course, path) {
    let username = user.username;
    let password = user.password;
    
    const response = await this.api(path, 'PUT', course, true, {username, password});
    if (response.status === 204) {
      console.log('This worked!');

      return [];
    }
    else if (response.status === 403) {
      return response.json().then(data => {
        window.alert(data.message);
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  async destroyCourse(username, password, path){
    const response = await this.api(path, 'DELETE', null, true, {username, password});
    
    if (response.status === 204) {
      console.log('Deleteddd!');
      return 204;
    }
    else if (response.status === 403)
    {
      return response.json().then(data => {
        window.alert(data.message);
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }
}
