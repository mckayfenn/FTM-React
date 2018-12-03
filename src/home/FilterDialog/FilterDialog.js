import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles,
} from '@material-ui/core';

const styles = theme => ({});

class FilterDialog extends React.Component {
  state = {
    open: false,
    includes: [],
    excludes: [],
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleCancel = () => {
    this.setState({ open: false, includes: [], excludes: [] });
  };

  handleSave = () => {
    this.props.handleIngredientsFilter(this.state.includes, this.state.excludes);
    this.setState({ open: false });
  };

  handleOnChangeIncludes = (event) => {
    this.setState({ includes: event.target.value.split(',') });
  };

  handleOnChangeExcludes = (event) => {
    this.setState({ excludes: event.target.value.split(',') });
  };

  render() {
    return (
      <div style={{ width: '100%', flex: '1' }}>
        <Button onClick={this.handleClickOpen} color="primary">
          Ingredients
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleCancel}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Include/Exclude Ingredients</DialogTitle>
          <DialogContent>
            <DialogContentText>Separate ingredients by a single comma.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="include"
              label="Include"
              fullWidth
              onChange={event => this.handleOnChangeIncludes(event)}
            />
            <TextField
              margin="dense"
              id="exclude"
              label="Exclude"
              fullWidth
              onChange={event => this.handleOnChangeExcludes(event)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
FilterDialog.propTypes = {
  handleIngredientsFilter: PropTypes.func.isRequired,
};

export default withStyles(styles)(FilterDialog);
