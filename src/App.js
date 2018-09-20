import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import StoryGrid from './StoryGrid';
import StoryDialog from './StoryDialog';
import logo from './img/scraty-logo.png';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class App extends Component {

  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
      <img src={logo} alt="scraty logo"></img>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <StoryGrid />
            <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleClickOpen} className={classes.button}>
              <AddIcon />
            </Button>
            <StoryDialog open={this.state.open} onClose={this.handleClose} />
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(App);
