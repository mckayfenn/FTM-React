import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import AppBar from './home/AppBar/AppBar';
import Home from './home/Home';
import Recipe from './recipe/Recipe';
import Login from './login/Login';
import Logs from './logs/Logs';
import AddLog from './addlog/AddLog';
import Profile from './profile/Profile';
import Signup from './signup/Signup';
import Callback from './callback/Callback';
import Auth from './auth/Auth';
import './App.css';

const auth = new Auth();

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});
class App extends Component {
  render() {
    return (
      <div className="app-container">
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <div className="app-bar">
              <AppBar />
            </div>
            <div className="content-area" >
              <Route exact path="/" component={Home} />
              <Route exact path="/recipe" component={Recipe}/>
              <Route exact path="/recipe/:title" component={Recipe}/>
              <Route exact path="/recipe/:author/:title" component={Recipe}/>
              <Route path="/login" component={Login} />
              <Route path="/logs" component={Logs} />
              <Route path="/addlog" component={AddLog} />
              <Route path="/profile" component={Profile} />
              <Route path="/signup" component={Signup} />
              <Route path="/callback" component={(props) => {
                auth.handleAuthentication(props);
                return <Callback />;
              }} />
            </div>
          </MuiThemeProvider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
