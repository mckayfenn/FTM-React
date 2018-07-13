import React, { Component } from 'react';
import { Card, List, ListItem, Typography } from 'material-ui';
import './Ingredients.css';


const ingredientList = new Array(8);
let i;
for (i = 0; i < ingredientList.length; i++) {
  ingredientList[i] = "Item " + i;
}

class RecipeIngredients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: null,
      servings: null,
    };
  }

  render() {
    return (
      <div className="fullSize">
        <Card>
          <Typography component="p" className="ingredients-title">Ingredients<span className='servings'>This amount produces <b>{this.props.servings}</b> servings.</span></Typography>
          <List>
            {
              this.props.ingredients.map((ingredient, index) => {
                return <ListItem key={index}> {ingredient.quantity} {ingredient.unit} {ingredient.name} </ListItem>;
              })
            }
          </List>
        </Card>
      </div>
    );
  }
}

export default RecipeIngredients;