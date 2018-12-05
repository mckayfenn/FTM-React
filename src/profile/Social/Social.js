import React, { Component } from 'react';
import { compose, withApollo } from 'react-apollo';
import { Card, Icon } from '@material-ui/core';
import SocialButton from './SocialButton/SocialButton';
import withLocalData from '../../withLocalData';
import './Social.css';


const savedString = 'saved';
const ownedString = 'owned';
const followingString = 'following';
const madeThisString = 'madethis';

class Social extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owned_recipes_number: null,
      saved_recipes_number: null,
      made_this_number: null,
      following_number: null,
      my_profile: null,

      ownActive: false,
      saveActive: true,
      madeActive: false,
      followActive: false,
    };

    this.delegateShowResults = this.delegateShowResults.bind(this);
  }

 

  delegateShowResults(arg) {
    console.log('delegate show results clicked: ', arg);
    if (arg === savedString) {
      this.setState({
        ownActive: false,
        saveActive: true,
        madeActive: false,
        followActive: false,
      });
    } else if (arg === ownedString) {
      this.setState({
        ownActive: true,
        saveActive: false,
        madeActive: false,
        followActive: false,
      });
    } else if (arg === followingString) {
      this.setState({
        ownActive: false,
        saveActive: false,
        madeActive: false,
        followActive: true,
      });
    } else if (arg === madeThisString) {
      this.setState({
        ownActive: false,
        saveActive: false,
        madeActive: true,
        followActive: false,
      });
    }
    console.log('saveActive: ', this.state.saveActive);
    console.log('ownActive: ', this.state.ownActive);
    console.log('madeActive: ', this.state.madeActive);
    console.log('followActive: ', this.state.followActive);
    this.props.showResults(arg);
  }

  render() {
    console.log('my profile: ', this.state.my_profile);
    return (
      <div className='fullSize social-info'>

        <div className="info">
          <SocialButton
            icon={'library_books'}
            number={this.props.owned_recipes_number}
            title={'Owned Recipes'}
            delegateShow={ownedString}
            delegateShowResults={this.delegateShowResults}
            classActive={this.state.ownActive}
          />
          <SocialButton
            icon={'library_books'}
            number={this.props.saved_recipes_number}
            title={'Saved Recipes'}
            delegateShow={savedString}
            delegateShowResults={this.delegateShowResults}
            classActive={this.state.saveActive}
          />
          <SocialButton
            icon={'library_books'}
            number={this.props.made_this_number}
            title={'I Made These!'}
            delegateShow={madeThisString}
            delegateShowResults={this.delegateShowResults}
            classActive={this.state.madeActive}
          />
          {this.props.my_profile &&
            <SocialButton
              icon={'people'}
              number={this.props.following_number}
              title={'Following'}
              delegateShow={followingString}
              delegateShowResults={this.delegateShowResults}
              classActive={this.state.followActive}
            />
          }
          {!this.props.my_profile &&
            <Card className="num-container follow-button" onClick={() => this.props.followUser()}>
              <Icon>people</Icon>
              <span>Follow this user</span><br />
            </Card>
          }
          {/*
          <Card className="num-container owned-button" onClick={() => { this.props.showResults('owned'); this.changeActive(); }}>
            <Icon>library_books</Icon>
            <span className="number">{this.props.owned_recipes_number}</span><br />
            <span>Owned Recipes</span>
          </Card>
          <Card className="num-container saved-button btn-active" onClick={() => this.props.showResults('saved')}>
            <Icon>library_books</Icon>
            <span className="number">{this.props.saved_recipes_number}</span><br />
            <span>Saved Recipes</span>
          </Card>
          <Card className="num-container madethis-button" onClick={() => this.props.showResults('madethis')}>
            <Icon>library_books</Icon>
            <span className="number">{this.props.made_this_number}</span><br />
            <span>I Made These!</span>
          </Card>
          {this.props.my_profile &&
            <Card className="num-container following-button" onClick={() => this.props.showResults('following')}>
              <Icon>people</Icon>
              <span className="number">{this.props.following_number}</span><br />
              <span>Following</span>
            </Card>
          }
          {!this.props.my_profile &&
            <Card className="num-container follow-button" onClick={() => this.props.followUser()}>
              <Icon>people</Icon>
              <span>Follow this user</span><br />
            </Card>
          }
          */}
        </div>

      </div>
    );
  }
}

export default compose(
  withLocalData,
  withApollo,
)(Social);
