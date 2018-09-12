import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import './Login.css';
import Auth from '../auth/Auth';
import fbLogo from '../assets/images/fb-logo.png';
import ggLogo from '../assets/images/g-ico.png';

class Login extends Component {

  auth = new Auth();

  login = () => {
    this.auth.login();
  }

  render() {
    return (
      <form className="login-root">
        <div className="social-buttons">
          <Button variant="raised" color="primary" id="fb-btn"><img alt="fb-logo" id="fb-logo" src={fbLogo} />Log in With Facebook</Button>
          <Button variant="raised" id="google-btn" onClick={this.login}><img id="gg-logo" alt="gg-logo" src={ggLogo} />Log in With Google</Button>
        </div>
        <TextField label="Username or Email" fullWidth className="username" />
        <TextField label="Password" fullWidth className="password" />
        <Button variant="raised" color="primary" className="submit-btn">Submit</Button>
      </form>
    );
  }
}

export default Login;
