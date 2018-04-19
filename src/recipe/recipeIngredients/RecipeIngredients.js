import React, { Component } from 'react';
import { Card, List, ListItem, Typography } from 'material-ui';
import './RecipeIngredients.css';


const ingredientList = new Array(8);
let i;
for (i = 0; i < ingredientList.length; i++) {
  ingredientList[i] = "Item " + i;
}

class RecipeIngredients extends Component {
  
  /*
  displayItems = () => {
    let outer = [];
    outer.push(<Grid><List>);
    for (let i = 0; i < ingredientList.length; i++) {
      if (i % 5 == 0) {
        outer.push(</List></Grid><Grid><List>)
      }
      outer.push(<ListItem>{ingredientList[i]}</ListItem>);
    }
    outer.push(</List><Grid>);
    return outer;
  }
  /*

  /*
  createTable = () => {
    let table = [];
    table.push(<h1>what</h1>);
    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
      let children = [];
      // Inner loop to create children
      for (let j = 0; j < 5; j++) {
        children.push(<td>{`Column ${j + 1}`}</td>);
        children.push(<td>what</td>);
      }
      // Create the parent and add the children
      table.push(<tr>{children}</tr>);
    }
    return (<table>{table}</table>);
  }
  */
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <div className="fullSize">
        <Card>
          <Typography component="p" className="ingredients-title">Ingredients</Typography>
          <List>
            {
              this.props.value.map((ingredient, index) => {
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
