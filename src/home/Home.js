import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputAdornment,
  InputLabel,
  IconButton,
  Button,
  Paper,
  FormControl,
  withStyles,
  Grid,
} from '@material-ui/core';
import { FilterList, Close } from '@material-ui/icons';
import { Spring, Trail, animated } from 'react-spring';
import { withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
import HomeFilter from './Filter/Filter';
import SearchResult from './SearchResult/SearchResult';
import './Home.css';
import { Menu } from 'material-ui';
import FilterButton from './FilterButton/FilterButton';

const styles = {
  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  heading: {},
  secondaryHeading: {},
  column: {
    flexBasis: '33.33%',
    width: '30%',
  },
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      recipes: [],
      loading: false,
      showFilter: false,
      anchorElCookTime: null,
      anchorElPrepTime: null,
      anchorElDifficulty: null,
      anchorElRating: null,
      anchorElIngredients: null,
    };
  }

  handleEnterSearch = async (event) => {
    const { client } = this.props;
    if (event.key === 'Enter') {
      const { data } = await client.query({
        query: gql`
                query {
                  searchAllRecipes(query: "${this.state.query}") {
                    id
                    name
                    description
                    images
                  }
                }`,
      });
      this.setState({
        loading: true,
        recipes: data.searchAllRecipes,
      });
    }
  };

  handleButtonSearch = async () => {
    const { client } = this.props;
    const { data } = await client.query({
      query: gql`
                query {
                  searchAllRecipes(query: "${this.state.query}") {
                    id
                    name
                    description
                    images
                  }
                }`,
    });
    this.setState({
      loading: true,
      recipes: data.searchAllRecipes,
    });
  };

  handleQueryChange = (event) => {
    this.setState({
      query: event.target.value,
    });
  };

  toggleFilter = () => {
    this.setState({ showFilter: !this.state.showFilter });
  };

  getFilterClassNames = () => {
    const classes = ['filter-card'];
    if (this.state.showFilter) {
      classes.push('showFilter');
    } else {
      classes.push('hideFilter');
    }
    return classes.join(' ');
  };

  handleMouseDown = (event) => {
    event.preventDefault();
  };

  render() {
    return (
      <div className="home-container">
        <Spring
          from={{ marginTop: 200, opacity: 1 }}
          to={this.state.recipes.length > 0 ? { marginTop: 0 } : { marginTop: 200 }}
        >
          {({ marginTop, opacity }) => (
            <img
              className="logo"
              style={{ marginTop }}
              src="http://i63.tinypic.com/14joi09.png"
              alt="logo"
            />
          )}
        </Spring>
        <Spring
          from={{ marginTop: 200 }}
          to={this.state.recipes.length > 0 ? { marginTop: 0 } : { marginTop: 200 }}
        >
          {({ marginTop }) => (
            <div className="search-box" style={{ marginTop }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="search">Search for a recipe...</InputLabel>
                <Input
                  id="search"
                  onKeyPress={this.handleEnterSearch}
                  onChange={this.handleQueryChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onMouseDown={this.handleMouseDown} onClick={this.toggleFilter}>
                        <FilterList size={30} />
                      </IconButton>
                      <Button id="searchButton" onClick={this.handleButtonSearch}>
                        Search
                      </Button>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          )}
        </Spring>
        <div
          className="search-filters"
          style={
            this.state.recipes.length > 0
              ? { marginTop: 10, display: 'flex' }
              : { marginTop: 210, display: 'flex' }
          }
        >
          <FilterButton title="Cook Time" items={['One', 'Two', 'Three']} />
          <FilterButton title="Prep. Time" items={['2', 'Two', 'two']} />
          <FilterButton title="Difficulty" items={['One', 'Two', 'Three']} />
          <FilterButton title="Rating" items={['2', 'Two', 'two']} />
          <FilterButton title="Ingredients" items={['One', 'Two', 'Three']} />
        </div>
        <div
          className="search-results"
          style={this.state.recipes.length > 0 ? { marginTop: 0 } : { marginTop: 200 }}
        >
          {this.state.recipes.length > 0 && (
            <Grid container>
              <Trail
                native
                keys={this.state.recipes.map(item => item.id)}
                from={{ marginTop: 500, opacity: 0 }}
                to={{ marginTop: 0, opacity: 1 }}
              >
                {this.state.recipes.map(recipe => (marginTop, index) => {
                  return (
                    <Grid item md={4} sm={6} xs={6} zeroMinWidth>
                      <animated.div key={index} style={marginTop}>
                        <SearchResult
                          key={recipe.id}
                          name={recipe.name}
                          style={marginTop}
                          description={recipe.description}
                          images={recipe.images}
                          r_id={recipe.id}
                        />
                      </animated.div>
                    </Grid>
                  );
                })}
              </Trail>
            </Grid>
          )}
        </div>
        <Paper className={this.getFilterClassNames()} elevation={5}>
          <IconButton className="close-filters" onClick={this.toggleFilter}>
            <Close />
          </IconButton>
          <HomeFilter filter="Time" color="primary" />
        </Paper>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withApollo,
)(Home);
