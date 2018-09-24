import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import './Signup.css';
import fbLogo from '../assets/images/fb-logo.png';
import ggLogo from '../assets/images/g-ico.png';
import Auth from '../auth/Auth';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      passConfirm: '',
    };
  }

  auth = new Auth();

  loginGoogle = () => {
    this.auth.loginGoogle();
  };

  loginFacebook = () => {
    this.auth.loginFacebook();
  };

  handleSubmit = async () => {};

  render() {
    return (
      <form className="login-root">
        <div className="social-buttons">
          <Button onClick={this.loginFacebook} variant="raised" color="primary" id="fb-btn">
            <img id="fb-logo" alt="fb-logo" src={fbLogo} />
            Sign up With Facebook
          </Button>
          <Button onClick={this.loginGoogle} variant="raised" id="google-btn">
            <img id="gg-logo" alt="gg-logo" src={ggLogo} />
            Sign up With Google
          </Button>
        </div>
        <TextField
          label="Email"
          fullWidth
          className="email"
          onChange={event => this.setState({ email: event.target.value })}
        />
        <TextField
          label="Username"
          fullWidth
          className="username"
          onChange={event => this.setState({ username: event.target.value })}
        />
        <TextField
          label="Password"
          fullWidth
          className="password"
          onChange={event => this.setState({ password: event.target.value })}
        />
        <TextField
          label="Verify Password"
          fullWidth
          className="verify"
          onChange={event => this.setState({ passConfirm: event.target.value })}
        />
        <Button variant="raised" color="primary" className="submit-btn" onClick={this.handleSubmit}>
          Submit
        </Button>
      </form>
    );
  }
}

export default SignUp;
