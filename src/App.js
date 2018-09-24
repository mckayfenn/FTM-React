import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './home/Home';
import Recipe from './recipe/Recipe';
import Login from './login/Login';
import Logs from './logs/Logs';
import AddLog from './addlog/AddLog';
import Profile from './profile/Profile';
import Signup from './signup/Signup';
import CallbackReceiver from './callback/CallbackReceiver';
import SignOut from './signOut/SignOut';
import withLocalData from './withLocalData';

class App extends Component {
  render() {
    console.log(this.props);
    const { token } = this.props;
    return (
      <div>
        <Switch>
          <Route exact path="/" component={() => <Home token={token} />} />
          <Route exact path="/recipe" component={Recipe} />
          <Route exact path="/recipe/:id" component={Recipe} />
          <Route exact path="/login" component={Login} />
          <Route path="/logs" component={Logs} />
          <Route path="/addlog" component={AddLog} />
          <Route path="/profile" component={Profile} />
          <Route path="/signup" component={Signup} />
          <Route path="/signout" component={SignOut} />
          <Route
            path="/auth/google/callback"
            component={() => {
              return <CallbackReceiver token={token} source={'google'} />;
            }}
          />
          <Route
            path="/auth/facebook/callback"
            component={() => {
              return <CallbackReceiver token={token} source={'facebook'} />;
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default withLocalData(App);
