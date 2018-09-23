import React, { Component } from 'react';
// import { Redirect } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import './Username.css';
import { withApollo } from 'react-apollo';
import { createUserSocial } from '../graphql/mutations';

class Username extends Component {
  state = {
    usernameExists: false,
    username: '',
    error: ''
  };

  onSubmit = async event => {
    event.preventDefault();
    console.log(this.props);
    const { client, id, source } = this.props;
    const { data } = await client.mutate({
      mutation: createUserSocial,
      variables: {
        id: id,
        type: source,
        username: this.state.username
      }
    });
    console.log(data);
  };

  handleOnChange = event => {
    this.setState({ username: event.target.value });
  };

  handleOnKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSubmit(event);
    }
  };

  render() {
    return (
      <div>
        <form className="username-root" onSubmit={this.onSubmit}>
          <TextField
            label="Username"
            fullWidth
            className="username"
            onChange={this.handleOnChange}
            error={this.state.error.length > 0}
            helperText={this.state.error}
          />
          <Button
            variant="raised"
            color="primary"
            className="submit-btn"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

export default withApollo(Username);
