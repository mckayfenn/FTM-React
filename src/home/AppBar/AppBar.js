import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import { getToken } from '../../graphql/queries';
import SignOut from '../../signOut';

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginRight: 20
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
};

function HomeAppBar(props) {
  const { classes, token } = props;
  console.log(token);
  return (
    <div className={classes.root}>
      <AppBar id="main-app-bar" position="fixed">
        <Toolbar>
          <Typography
            variant="title"
            color="inherit"
            className={classes.flex}
            style={{ textDecoration: 'none' }}
            component={Link}
            to="/"
          >
            FoodtoMake
          </Typography>
          {token ? (
            <Button color="inherit" component={SignOut}>
              Sign Out
            </Button>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link}>
                Sign Up
              </Button>
              <Button color="inherit" component={Link}>
                Login
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default compose(
  graphql(getToken, {
    props: ({ data: { token } }) => ({ token })
  }),
  withStyles(styles)
)(HomeAppBar);
