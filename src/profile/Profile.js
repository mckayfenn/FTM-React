import React, { Component } from 'react';
import {
  Grid,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  Icon,
  Button
} from '@material-ui/core';
import { Spring, Trail, animated } from 'react-spring';
import gql from 'graphql-tag';
import { compose, withApollo } from 'react-apollo';
import { Route } from 'react-router-dom';
import ProfilePicture from './ProfilePicture/ProfilePicture';
import SearchResult from '../home/SearchResult/SearchResult';
import Social from './Social/Social';
import Loading from '../loading/Loading';
import FollowingProfile from './FollowingProfiles/FollowingProfiles';
import './Profile.css';
import withLocalData from '../withLocalData';

const jwt = require('jsonwebtoken');
const jsPDF = require('jspdf');
require('jspdf-autotable');

const styles = {
  spacing: 24,
  sizes: {
    xs: {
      picture: 12,
      social: 12,
      recipes: 12
    },
    sm: {
      picture: 8,
      social: 8,
      recipes: 8
    }
  },
  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    overflow: 'hidden'
  }
};

const savedString = 'saved';
const ownedString = 'owned';
const followingString = 'following';
const madeThisString = 'madethis';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_image: 'http://i65.tinypic.com/2rnvc7k.png',
      username: null,
      user_id: null,
      owned_recipes: [],
      saved_recipes: [],
      made_recipes: [],
      owned_recipes_length: null,
      saved_recipes_length: null,
      made_recipes_length: null,
      following: [],
      followers: [],
      following_length: null,
      followers_length: null,
      query: '',
      currently_viewing: 'saved', // ********** saved, owned, following, or madethis *************
      searchSavedOrOwned: true // search saved by default, so false means search owned
    };

    this.showResults = this.showResults.bind(this);
    this.followUser = this.followUser.bind(this);
    this.updateFollowing = this.updateFollowing.bind(this);
    this.exportToPdf = this.exportToPdf.bind(this);
    // this.getDataFromAPI();
  }

  showResults(arg) {
    console.log('SHOW RESULTS: ', arg);
    this.setState(
      {
        currently_viewing: arg
      },
      () => this.printClicked()
    );
  }
  printClicked() {
    console.log('clicked: ', this.state.currently_viewing);
    if (this.state.currently_viewing === savedString) {
      this.setState({
        searchSavedOrOwned: true
      });
    } else if (this.state.currently_viewing === ownedString) {
      this.setState({
        searchSavedOrOwned: false
      });
    } else {
      this.setState({
        searchSavedOrOwned: false
      });
    }
  }

  componentWillMount() {
    this.getDataFromAPI();
  }

  handleQueryChange = event => {
    this.setState({
      query: event.target.value
    });
  };

  handleMouseDown = event => {
    event.preventDefault();
  };

  handleEnterSearch = async event => {
    const { client } = this.props;
    if (event.key === 'Enter') {
      if (this.state.searchSavedOrOwned) {
        // search trhough saved
        const { data } = await client.query({
          query: gql`
            query {
              searchSavedRecipes(userId: "${this.state.user_id}" query: "${
            this.state.query
          }") {
                id
                name
                description
                images
              }
            }`
        });
        this.setState({
          loading: true,
          saved_recipes: data.searchSavedRecipes
        });
      } else {
        // search through owned
        const { data } = await client.query({
          query: gql`
            query {
              searchOwnedRecipes(userId: "${this.state.user_id}" query: "${
            this.state.query
          }") {
                id
                name
                description
                images
              }
            }`
        });
        this.setState({
          loading: true,
          owned_recipes: data.searchOwnedRecipes
        });
      }
    }
  };

  handleButtonSearch = async () => {
    const { client } = this.props;
    if (this.state.searchSavedOrOwned) {
      // search trhough saved
      const { data } = await client.query({
        query: gql`
          query {
            searchSavedRecipes(userId: "${this.state.user_id}" query: "${
          this.state.query
        }") {
              id
              name
              description
              images
            }
          }`
      });
      this.setState({
        loading: true,
        saved_recipes: data.searchSavedRecipes
      });
    } else {
      // search through owned
      const { data } = await client.query({
        query: gql`
          query {
            searchOwnedRecipes(userId: "${this.state.user_id}" query: "${
          this.state.query
        }") {
              id
              name
              description
              images
            }
          }`
      });
      this.setState({
        loading: true,
        owned_recipes: data.searchOwnedRecipes
      });
    }
  };

  exportToPdf() {
    const doc = new jsPDF();
    let rec = null;
    if (this.state.currently_viewing === savedString) {
      rec = this.state.saved_recipes;
    } else if (this.state.currently_viewing === ownedString) {
      rec = this.state.owned_recipes;
    } else if (this.state.currently_viewing === madeThisString) {
      rec = this.state.made_recipes;
    }

    for (let i = 0; i < rec.length; i++) {
      doc.setFontSize(35);
      doc.text(20, 20, rec[i].name);

      doc.setFontSize(16);
      const desc = rec[i].description;
      const desclines = doc.splitTextToSize(desc, 170);
      doc.text(20, 30, desclines);

      doc.setFontSize(25);
      doc.text(20, 50, 'Ingredients');
      doc.setFontSize(16);
      doc.text(20, 60, rec[i].ingredients);

      doc.setFontSize(25);
      doc.text(20, 170, 'Instructions');
      doc.setFontSize(16);
      const inst = rec[i].instructions;
      const lines = doc.splitTextToSize(inst, 170);
      doc.text(20, 180, lines);

      if (i + 1 < rec.length) {
        doc.addPage('a4', 'p');
      }
    }
    doc.save('recipes.pdf');
  }

  /** This whole function is garbage right now. ignore it */
  updateFollowing = async () => {
    console.log('Update Following');

    // First need to get the logged in users followers
    console.log('--------------------- tyring to get following');
    const { client, userId } = this.props;
    const info = {
      user_id: userId
    };
    await client
      .query({
        query: gql`
        query {
          userById(id: "${info.user_id}") {
            id
            username
            following {id username}
          }
        }`
      })
      .then(result => {
        console.log('result from getting userByID: ', result.data.userById);
        this.setState({
          following: result.data.userById.following
        });
        return result.info;
      });
    console.log('------------ after get following');

    // then get the other users info to follow them.
    await client
      .query({
        query: gql`
        query {
          userByUsername(username: "${this.state.username}") {
            id
            username
          }
        }`
      })
      .then(result => {
        console.log(
          'result from getting userbyUsername: ',
          result.data.userByUsername
        );
        console.log('current following: ', this.state.following);
        this.setState(
          previousState => ({
            following: [...previousState.following, result.data.userByUserName]
          }),
          this.followUser
        );
        return result.data;
      });
  };

  followUser = async () => {
    console.log(
      'vieweing profile for user: ',
      this.state.username,
      ', id: ',
      this.state.user_id
    );

    try {
      const { client } = this.props;
      const user = await this.fetchUser();
      console.log('logged in name: ', user.username, ' id: ', user.id);

      const result = client
        .mutate({
          mutation: gql`
          mutation FollowUser {
            followUser(
              userId: "${user.id}"
              followingId: "${this.state.user_id}"
            ) {
              id
              username
              followers {username}
              following {username}
            }
          }
          `
        })
        .then(result => {
          console.log('user followed: ', result.data);
          return result.data;
        });
      return result;
    } catch (err) {
      console.log(err);
      return {};
    }
  };

  async getDataFromAPI() {
    let user;
    if (this.props.match.params.username) {
      user = await this.fetchOtherUser();
    } else {
      user = await this.fetchUser();
    }

    console.log('user: \n', user);
    this.setState(
      {
        user_id: user.id,
        username: user.username,
        owned_recipes: user.ownedRecipes,
        saved_recipes: user.savedRecipes,
        made_recipes: user.madeRecipes,
        following: user.following,
        followers: user.followers
      },
      () => this.setLengths()
    );
  }

  setLengths() {
    this.setState({
      owned_recipes_length: this.state.owned_recipes.length,
      saved_recipes_length: this.state.saved_recipes.length,
      made_recipes_length: this.state.made_recipes.length,
      following_length: this.state.following.length,
      followers_length: this.state.followers.length
    });
  }

  // get the info of the logged in user
  fetchUser = async () => {
    try {
      const { client, token } = this.props;
      const decoded = jwt.decode(token);
      console.log('decoded is this: ', decoded.id);
      const result = client
        .query({
          query: gql`{           
            userById(
              id: "${decoded.id}"
            ) {
              id
              username
              ownedRecipes (limit: 100) {name id description images ingredients instructions}
              savedRecipes {name id description images ingredients instructions}
              madeRecipes {name id description images ingredients instructions}
              following {id username profilePicture}
              followers {id username profilePicture}
            }
          }
        `,
          fetchPolicy: 'network-only'
        })
        .then(result => {
          console.log('fetchUser: ', result.data.userById);
          return result.data.userById;
        });
      return result;
    } catch (err) {
      console.log(err);
      return {};
    }
  };

  // get the info when viewing anothers profile
  fetchOtherUser = async () => {
    console.log('get other user: ', this.props.match.params.username);
    try {
      const { client } = this.props;
      const result = client
        .query({
          query: gql`{           
            userByUsername(
              username: "${this.props.match.params.username}"
            ) {
              id
              username
              ownedRecipes {name id description images}
              savedRecipes {name id description images}
              madeRecipes {name id description images}
              following {id username profilePicture}
              followers {id username profilePicture}
            }
          }
        `,
          fetchPolicy: 'network-only'
        })
        .then(result => {
          console.log('data got back: \n', result.data.userByUsername);
          return result.data.userByUsername;
        });
      return result;
    } catch (err) {
      console.log('Error: ', err);
      return {};
    }
  };

  render() {
    // don't render until we have data loaded
    if (!this.state.username) {
      return <Loading />;
    }

    let savedShow = true;
    let ownedShow = false;
    let followShow = false;
    let madeThisShow = false;
    if (this.state.currently_viewing === savedString) {
      savedShow = true;
      ownedShow = false;
      followShow = false;
      madeThisShow = false;
    } else if (this.state.currently_viewing === ownedString) {
      savedShow = false;
      ownedShow = true;
      followShow = false;
      madeThisShow = false;
    } else if (this.state.currently_viewing === followingString) {
      savedShow = false;
      ownedShow = false;
      followShow = true;
      madeThisShow = false;
    } else if (this.state.currently_viewing === madeThisString) {
      savedShow = false;
      ownedShow = false;
      followShow = false;
      madeThisShow = true;
    }

    let myProfile = true;
    if (this.props.match.params.username) {
      myProfile = false; // viewing somebody elses profile
    } else {
      myProfile = true;
    }

    return (
      <div>
        <Grid
          className="user-container"
          container
          spacing={styles.spacing}
          justify={'center'}
        >
          <Grid
            className="picture"
            item
            xs={styles.sizes.xs.picture}
            sm={styles.sizes.sm.picture}
          >
            <ProfilePicture
              name={this.state.username}
              imageURL={this.state.user_image}
            />
          </Grid>
          <Grid
            className="social"
            item
            xs={styles.sizes.xs.social}
            sm={styles.sizes.sm.social}
          >
            <Social
              owned_recipes_number={this.state.owned_recipes_length}
              saved_recipes_number={this.state.saved_recipes_length}
              made_this_number={this.state.made_recipes_length}
              following_number={this.state.following_length}
              showResults={this.showResults}
              my_profile={myProfile}
              followUser={this.followUser}
            />
            {!followShow && myProfile && ( // don't show export if they are looking at followers
              <Grid item>
                <Route
                  render={({ history }) => (
                    <Button
                      variant="contained"
                      color="secondary"
                      Title="Export to .pdf"
                      className="export-recipes-button"
                      /*onClick={() => {
                        history.push(`/exportrecipes/${this.state.saved_recipes}`);
                      }}*/
                      onClick={this.exportToPdf}
                    >
                      <Icon>picture_as_pdf</Icon>
                      Export to PDF
                    </Button>
                  )}
                />

                <Route
                  render={({ history }) => (
                    <Button
                      variant="contained"
                      color="primary"
                      title="Create Recipe"
                      className="create-recipe-button"
                      onClick={() => {
                        history.push('/createrecipe');
                      }}
                    >
                      <Icon>import_contacts</Icon>
                      Create Recipe
                    </Button>
                  )}
                />
              </Grid>
            )}
          </Grid>

          {!followShow && ( // don't show search box if they are looking at followers
            <Grid
              className="search-box"
              item
              xs={styles.sizes.xs.social}
              sm={styles.sizes.sm.social}
            >
              <Spring
                from={{ marginTop: 0 }}
                to={
                  this.state.saved_recipes.length > 0
                    ? { marginTop: 10 }
                    : { marginTop: 10 }
                }
              >
                {({ marginTop }) => (
                  <div className="search-box" style={{ marginTop }}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="search">
                        Search for a recipe...
                      </InputLabel>
                      <Input
                        id="search"
                        onKeyPress={this.handleEnterSearch}
                        onChange={this.handleQueryChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <Button
                              id="searchButton"
                              onClick={this.handleButtonSearch}
                            >
                              <i class="material-icons">search</i>
                            </Button>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </div>
                )}
              </Spring>
            </Grid>
          )}

          <Grid
            className="users-recipes"
            item
            xs={styles.sizes.xs.recipes}
            sm={styles.sizes.sm.recipes}
          >
            <div className="search-results">
              {savedShow && (
                <Grid container>
                  <Trail
                    native
                    keys={this.state.saved_recipes.map(item => item.id)}
                    from={{ marginTop: 500, opacity: 0 }}
                    to={{ marginTop: 0, opacity: 1 }}
                  >
                    {this.state.saved_recipes.map(
                      recipe => (marginTop, index) => {
                        return (
                          <Grid item md={6} sm={4} xs={12} zeroMinWidth>
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
                      }
                    )}
                  </Trail>
                </Grid>
              )}

              {ownedShow && myProfile && (
                <Grid container>
                  <Trail
                    native
                    keys={this.state.owned_recipes.map(item => item.id)}
                    from={{ marginTop: 500, opacity: 1 }}
                    to={{ marginTop: -2, opacity: 1 }}
                  >
                    {this.state.owned_recipes.map(
                      recipe => (marginTop, index) => {
                        return (
                          <Grid item md={6} sm={4} xs={12} zeroMinWidth>
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
                      }
                    )}
                  </Trail>
                </Grid>
              )}

              {madeThisShow && (
                <Grid container>
                  <Trail
                    native
                    keys={this.state.made_recipes.map(item => item.id)}
                    from={{ marginTop: 500, opacity: 1 }}
                    to={{ marginTop: 0, opacity: 1 }}
                  >
                    {this.state.made_recipes.map(
                      recipe => (marginTop, index) => {
                        return (
                          <Grid item md={6} sm={4} xs={12} zeroMinWidth>
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
                      }
                    )}
                  </Trail>
                </Grid>
              )}

              {followShow && (
                <Grid container>
                  <Trail
                    native
                    keys={this.state.following.map(item => item.id)}
                    from={{ marginTop: 500, opacity: 1 }}
                    to={{ marginTop: 0, opacity: 1 }}
                  >
                    {this.state.following.map(
                      userProfile => (marginTop, index) => {
                        return (
                          <Grid item md={6} sm={4} xs={12} zeroMinWidth>
                            <animated.div key={index} style={marginTop}>
                              <FollowingProfile
                                key={userProfile.id}
                                name={userProfile.username}
                                style={marginTop}
                                images={userProfile.profilePicture}
                                r_id={userProfile.username}
                              />
                            </animated.div>
                          </Grid>
                        );
                      }
                    )}
                  </Trail>
                </Grid>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withLocalData,
  withApollo
)(Profile);
