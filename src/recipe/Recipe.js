import React, { Component } from 'react';
import { Grid } from 'material-ui';
import axios from 'axios';
import './Recipe.css';
import RecipeInstructions from './recipeInstructions/RecipeInstructions';
import RecipeInfo from './recipeInfo/RecipeInfo';
import RecipeIngredients from './recipeIngredients/RecipeIngredients';
import RecipeDescription from './recipeDescription/RecipeDescription';
import RecipePicture from './recipePicture/RecipePicture';

const styles = {
  spacing: 24,
  sizes: {
    xs: {
      picture: 8,
      description: 8,
      ingredients: 8,
      instructions: 8,
      author: 8,
      title: 8,
    },
    sm: {
      picture: 4,
      description: 4,
      ingredients: 8,
      instructions: 8,
      author: 8,
      title: 8,
    },
  },
};

const ingredientList = new Array(8);
let i;
for (i = 0; i < ingredientList.length; i++) {
  ingredientList[i] = 'ingredient ' + i;
}
const instructionsList = new Array(4);
for (i = 0; i < instructionsList.length; i++) {
  instructionsList[i] = 'instruction ' + i;
}
const tagsList = new Array(3);
for (i = 0; i < tagsList.length; i++) {
  tagsList[i] = 'tag ' + i;
}


class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: ingredientList,
      instructions: instructionsList,
      description: 'This is a test description',
      image: 'https://s3-us-west-2.amazonaws.com/foodtomake-photo-storage/flayed-man-cheese-ball.jpg',
      title: this.props.match.params.title,
      stars: 4,
      tags: tagsList,
      author: this.props.match.params.author,
      authorImage: 'https://s3-us-west-2.amazonaws.com/foodtomake-photo-storage/person5-128.png',
      cookTime: 15,
      prepTime: 10,
      difficulty: 3,
      sourceURL: 'www.google.com',
      servings: 3,
      // recipe_id: this.props.match.params.recipe_id,
    };
    this.getDataFromAPI();
    console.log(this.state.recipe_id);
  }

  async getDataFromAPI() {
    const recipe = await this.fetchRecipe();
    console.log('recipe: \n', recipe);
    this.setState({
      title: recipe.name,
      author: recipe.author,
     // authorImage: recipe.author.image,
      image: recipe.images[0],
      cookTime: recipe.cookTime,
      prepTime: recipe.prepTime,
      difficulty: recipe.difficulty,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients,
      tags: recipe.tags,
      description: recipe.description,
      sourceURL: recipe.sourceURL,
      servings: recipe.servings,
      stars: recipe.rating,
      //recipe_id: recipe._id,
    });
    if (this.state.authorImage == null || this.state.authorImage === '') {
      this.setState({
        authorImage: 'https://s3-us-west-2.amazonaws.com/foodtomake-photo-storage/person5-128.png',
      });
    }
  }

  fetchRecipe = async () => {
    const data = {
      query: this.state.title,
      limit: '1',
      offset: '0',
      filters: [
        {
          field: 'author',
          operator: '=',
          values: [this.state.author],
        },
      ],
    };
    try {
      const response = await axios.post('http://localhost:8081/public/recipes', data);
      console.log('completed GET request');
      console.log(data);
      return response.data.recipes[0];
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  render() {
    return (
      <div style={{width: "100% - 24px"}}>
        <Grid className='pic-des-container' container spacing={styles.spacing} justify={'center'}>
          <Grid className='picture' item xs={styles.sizes.xs.picture} sm={styles.sizes.sm.picture}>
            <RecipePicture title={this.state.title} stars={this.state.stars} imageURL={this.state.image} />
          </Grid>
          <Grid className='description' item xs={styles.sizes.xs.description} sm={styles.sizes.sm.description}>
            <RecipeDescription desc={this.state.description}/>
          </Grid>
          <Grid className='info' item xs={styles.sizes.xs.author} sm={styles.sizes.sm.author}>
            <RecipeInfo authorImage={this.state.authorImage} authorName={this.state.author} prepTime={this.state.prepTime} cookTime={this.state.cookTime} difficulty={this.state.difficulty} tags={this.state.tags} />
          </Grid>
          <Grid className='ingredients' item xs={styles.sizes.xs.instructions} sm={styles.sizes.sm.instructions}>
            <RecipeIngredients ingredients={this.state.ingredients} servings={this.state.servings} />
          </Grid>
          <Grid className='instructions' item xs={styles.sizes.xs.ingredients} sm={styles.sizes.sm.ingredients}>
            <RecipeInstructions value={this.state.instructions} />
          </Grid>
          <Grid className='source-url' item xs={styles.sizes.xs.ingredients} sm={styles.sizes.sm.ingredients}>
            <span>Recipe taken from <a href={this.state.sourceURL}>{this.state.sourceURL}</a></span>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Recipe;
