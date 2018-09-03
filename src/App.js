import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import StoryGrid from './StoryGrid';
import StoryDialog from './StoryDialog';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
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
    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className={this.props.paper}>
              <StoryGrid />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleClickOpen} className={this.props.button}>
              <AddIcon />
            </Button>
            <StoryDialog open={this.state.open} onClose={this.handleClose} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
